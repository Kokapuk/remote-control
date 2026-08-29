use crate::keyboard::{BaseKeyboard, Keyboard, WindowsKeyboard};
use crate::mouse::{BaseMouse, Mouse, WindowsMouse};
use futures::{SinkExt, StreamExt};
use gethostname::gethostname;
use serde::Deserialize;
use std::panic;
use std::sync::atomic::AtomicUsize;
use std::sync::{
    LazyLock, RwLock,
    atomic::{AtomicBool, Ordering},
};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{
    WebSocketStream, accept_hdr_async,
    tungstenite::{
        Utf8Bytes,
        handshake::server::{ErrorResponse, Request, Response},
        http::{StatusCode, header::ORIGIN},
        protocol::{CloseFrame, Message, frame::coding::CloseCode},
    },
};
use tokio_util::sync::CancellationToken;
use url::Url;

#[derive(Debug, Deserialize)]
#[serde(tag = "type")]
pub enum MessageData {
    #[serde(rename = "leftClick")]
    LeftClick,

    #[serde(rename = "rightClick")]
    RightClick,

    #[serde(rename = "middleClick")]
    MiddleClick,

    #[serde(rename = "leftPress")]
    LeftPress,

    #[serde(rename = "leftRelease")]
    LeftRelease,

    #[serde(rename = "move")]
    Move { x: i32, y: i32 },

    #[serde(rename = "scroll")]
    Scroll { x: i32, y: i32 },

    #[serde(rename = "keyboardPress")]
    KeyboardPress { keycode: u8 },
}

pub enum ServerEvent {
    Start,
    Stop,
    Log { message: String },
}

type EventCallback = Box<dyn Fn(&ServerEvent) + Send + Sync>;
type EventListener = (usize, EventCallback);

static LISTENER_ID: AtomicUsize = AtomicUsize::new(0);
static EVENT_LISTENERS: LazyLock<RwLock<Vec<EventListener>>> =
    LazyLock::new(|| RwLock::new(Vec::new()));
static SERVER_RUNNING: AtomicBool = AtomicBool::new(false);
static CANCEL_TOKEN: RwLock<Option<CancellationToken>> = RwLock::new(None);
static ALLOW_MULTIPLE_CONNECTIONS: AtomicBool = AtomicBool::new(false);
static CLIENT_CONNECTED: AtomicBool = AtomicBool::new(false);
static MOUSE: LazyLock<Mouse> = LazyLock::new(|| Mouse::new(Box::new(WindowsMouse)));
static KEYBOARD: LazyLock<Keyboard> = LazyLock::new(|| Keyboard::new(Box::new(WindowsKeyboard)));
static REMOTE_FRONTEND_ORIGIN: LazyLock<String> = LazyLock::new(|| {
    Url::parse(env!("VITE_REMOTE_FRONTEND_URL"))
        .expect("VITE_REMOTE_FRONTEND_URL must be a valid URL")
        .origin()
        .ascii_serialization()
});

pub fn add_event_listener(callback: EventCallback) -> usize {
    let mut listeners = EVENT_LISTENERS.write().unwrap();
    let id = LISTENER_ID.fetch_add(1, Ordering::SeqCst);

    listeners.push((id, callback));

    id
}

pub fn _remove_event_listener(remove_id: usize) {
    let mut listeners = EVENT_LISTENERS.write().unwrap();
    listeners.retain(|(id, _)| *id != remove_id);
}

fn emit_event(event: ServerEvent) {
    let listeners = EVENT_LISTENERS.read().unwrap();
    listeners.iter().for_each(|(_, f)| f(&event));
}

pub async fn start_server(port: u16, allow_multiple_connections: Option<bool>) {
    let listener = match TcpListener::bind(format!("0.0.0.0:{port}")).await {
        Ok(listener) => listener,
        Err(e) => {
            emit_event(ServerEvent::Log {
                message: e.to_string(),
            });
            return;
        }
    };

    let mut cancel_token = CANCEL_TOKEN.write().unwrap();
    *cancel_token = Some(CancellationToken::new());

    ALLOW_MULTIPLE_CONNECTIONS.store(
        allow_multiple_connections.unwrap_or(false),
        Ordering::SeqCst,
    );

    tauri::async_runtime::spawn(handle_server_running(listener));
    SERVER_RUNNING.store(true, Ordering::SeqCst);
    emit_event(ServerEvent::Start);
    emit_event(ServerEvent::Log {
        message: "Server started".to_string(),
    });
}

async fn handle_server_running(listener: TcpListener) {
    let cancel_token = CANCEL_TOKEN.read().unwrap().clone().unwrap();

    loop {
        tokio::select! {
            accept_result = listener.accept() => {
                match accept_result {
                    Ok((stream, _)) => {
                        tauri::async_runtime::spawn(handle_new_connection(stream));
                    }
                    Err(e) => {
                        emit_event(ServerEvent::Log { message: e.to_string() });
                    }
                }
            }

            _ = cancel_token.cancelled() => {
                break;
            }
        }
    }

    SERVER_RUNNING.store(false, Ordering::SeqCst);
    emit_event(ServerEvent::Stop);
    emit_event(ServerEvent::Log {
        message: "Server stopped".to_string(),
    });
}

async fn handle_new_connection(stream: TcpStream) {
    let mut ws = match accept_websocket(stream).await {
        Ok(ws) => ws,
        Err(message) => {
            emit_event(ServerEvent::Log { message });
            return;
        }
    };

    if !ALLOW_MULTIPLE_CONNECTIONS.load(Ordering::SeqCst)
        && CLIENT_CONNECTED.swap(true, Ordering::SeqCst)
    {
        let _ = ws
            .close(Some(CloseFrame {
                code: CloseCode::Error,
                reason: "Server already has active connection".into(),
            }))
            .await;

        emit_event(ServerEvent::Log {
            message: "Client rejected: server already has an active connection".to_string(),
        });

        return;
    }

    match handle_connection(ws).await {
        Err(message) => emit_event(ServerEvent::Log { message }),
        _ => {}
    }
}

async fn accept_websocket(stream: TcpStream) -> Result<WebSocketStream<TcpStream>, String> {
    accept_hdr_async(stream, |request: &Request, response: Response| {
        let origin = request
            .headers()
            .get(ORIGIN)
            .and_then(|value| value.to_str().ok());

        if origin.is_some_and(is_origin_allowed) {
            return Ok(response);
        }

        let origin = origin.unwrap_or("missing");
        emit_event(ServerEvent::Log {
            message: format!("Client rejected: origin {origin} is not allowed"),
        });

        let mut response = ErrorResponse::new(Some("Forbidden origin".to_string()));
        *response.status_mut() = StatusCode::FORBIDDEN;
        Err(response)
    })
    .await
    .map_err(|error| error.to_string())
}

fn is_origin_allowed(origin: &str) -> bool {
    origin == REMOTE_FRONTEND_ORIGIN.as_str()
        || (cfg!(debug_assertions)
            && matches!(origin, "http://localhost:5173" | "http://127.0.0.1:5173"))
}

async fn handle_connection(ws_stream: WebSocketStream<TcpStream>) -> Result<(), String> {
    struct ConnectionGuard;

    impl Drop for ConnectionGuard {
        fn drop(&mut self) {
            CLIENT_CONNECTED.store(false, Ordering::SeqCst);
        }
    }

    let _connection_guard = ConnectionGuard;

    let (mut sender, mut receiver) = ws_stream.split();

    match sender
        .send(Message::Text(gethostname().into_string().unwrap().into()))
        .await
    {
        Err(e) => return Err(e.to_string()),
        _ => {}
    }

    emit_event(ServerEvent::Log {
        message: "Client connected".to_string(),
    });

    let cancel_token = CANCEL_TOKEN.read().unwrap().clone().unwrap();

    let disconnection_error = loop {
        tokio::select! {
            msg = receiver.next() => {
                match msg {
                    Some(Ok(Message::Text(content))) => {
                        match handle_message(content) {
                          Err(message) => break Err(message),
                          _ => {}
                        };
                    }
                    Some(Ok(Message::Close(_))) => {
                        break Ok(());
                    }
                    Some(Ok(_)) => {},
                    Some(Err(e)) => {
                        break Err(e.to_string());
                    }
                    None => break Ok(()),
                }
            }

            _ = cancel_token.cancelled() => break Ok(()),
        }
    };

    emit_event(ServerEvent::Log {
        message: "Client disconnected".to_string(),
    });

    disconnection_error
}

fn handle_message(content: Utf8Bytes) -> Result<(), String> {
    let data = match serde_json::from_str::<MessageData>(&content) {
        Ok(result) => result,
        Err(e) => return Err(e.to_string()),
    };

    match data {
        MessageData::LeftClick => {
            MOUSE.click_left();
        }
        MessageData::RightClick => {
            MOUSE.click_right();
        }
        MessageData::MiddleClick => {
            MOUSE.click_middle();
        }
        MessageData::LeftPress => {
            MOUSE.press_left();
        }
        MessageData::LeftRelease => {
            MOUSE.release_left();
        }
        MessageData::Move { x, y } => {
            MOUSE.move_relative(x, y);
        }
        MessageData::Scroll { x, y } => {
            MOUSE.scroll(x, y);
        }
        MessageData::KeyboardPress { keycode } => {
            KEYBOARD.press(keycode);
        }
    }

    Ok(())
}

pub fn stop_server() {
    if let Some(cancel_token) = CANCEL_TOKEN.read().unwrap().as_ref() {
        cancel_token.cancel();
    }
}

pub fn is_server_running() -> bool {
    SERVER_RUNNING.load(Ordering::SeqCst)
}

#[cfg(test)]
mod tests {
    use super::{REMOTE_FRONTEND_ORIGIN, is_origin_allowed};

    #[test]
    fn allows_the_configured_remote_origin() {
        assert!(is_origin_allowed(REMOTE_FRONTEND_ORIGIN.as_str()));
    }

    #[test]
    fn rejects_an_unconfigured_origin() {
        assert!(!is_origin_allowed("https://malicious.example"));
    }
}
