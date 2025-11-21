use crate::APP_HANDLE;
use crate::keyboard::{BaseKeyboard, Keyboard, WindowsKeyboard};
use crate::mouse::{BaseMouse, Mouse, WindowsMouse};
use futures::{SinkExt, StreamExt};
use gethostname::gethostname;
use serde::Deserialize;
use std::panic;
use std::sync::{
    LazyLock, RwLock,
    atomic::{AtomicBool, Ordering},
};
use tauri::Emitter;
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{
    accept_async,
    tungstenite::{
        Utf8Bytes,
        protocol::{CloseFrame, Message, frame::coding::CloseCode},
    },
};
use tokio_util::sync::CancellationToken;

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

static SERVER_RUNNING: AtomicBool = AtomicBool::new(true);
static CANCEL_TOKEN: RwLock<Option<CancellationToken>> = RwLock::new(None);
static ALLOW_MULTIPLE_CONNECTIONS: AtomicBool = AtomicBool::new(false);
static CLIENT_CONNECTED: AtomicBool = AtomicBool::new(false);
static MOUSE: LazyLock<Mouse> = LazyLock::new(|| Mouse::new(Box::new(WindowsMouse)));
static KEYBOARD: LazyLock<Keyboard> = LazyLock::new(|| Keyboard::new(Box::new(WindowsKeyboard)));

pub async fn start_server(port: u16, allow_multiple_connections: Option<bool>) {
    let listener = TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .expect("Failed to bind");

    let mut cancel_token = CANCEL_TOKEN.write().unwrap();
    *cancel_token = Some(CancellationToken::new());

    ALLOW_MULTIPLE_CONNECTIONS.store(
        allow_multiple_connections.unwrap_or(false),
        Ordering::SeqCst,
    );

    tauri::async_runtime::spawn(handle_server_running(listener));
    println!("Server started");

    APP_HANDLE
        .get()
        .unwrap()
        .emit("server-started", ())
        .unwrap();
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
                        println!("Accept error: {}", e);
                    }
                }
            }

            _ = cancel_token.cancelled() => {
                break;
            }
        }
    }

    println!("Server stopped");

    SERVER_RUNNING.store(false, Ordering::SeqCst);

    APP_HANDLE
        .get()
        .unwrap()
        .emit("server-stopped", ())
        .unwrap();
}

async fn handle_new_connection(stream: TcpStream) {
    if !ALLOW_MULTIPLE_CONNECTIONS.load(Ordering::SeqCst)
        && CLIENT_CONNECTED.swap(true, Ordering::SeqCst)
    {
        println!("Client rejected");

        if let Ok(mut ws) = accept_async(stream).await {
            ws.close(Some(CloseFrame {
                code: CloseCode::Error,
                reason: "Server already has active connection".into(),
            }))
            .await
            .unwrap();
        }

        return;
    }

    handle_connection(stream).await;
}

async fn handle_connection(stream: TcpStream) {
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            println!("Handshake error: {}", e);
            CLIENT_CONNECTED.store(false, Ordering::SeqCst);
            return;
        }
    };

    let (mut sender, mut receiver) = ws_stream.split();

    sender
        .send(Message::Text(gethostname().into_string().unwrap().into()))
        .await
        .expect("Handshake failed");
    println!("Client connected");

    let cancel_token = CANCEL_TOKEN.read().unwrap().clone().unwrap();

    let disconnected_with_error = loop {
        tokio::select! {
            msg = receiver.next() => {
                match msg {
                    Some(Ok(Message::Text(content))) => {
                        let result = panic::catch_unwind(|| handle_message(content));

                        if result.is_err() {
                            break true;
                        }
                    }
                    Some(Ok(Message::Close(_))) => {
                        break false;
                    }
                    Some(Ok(_)) => {},
                    Some(Err(e)) => {
                        println!("Error: {}", e);
                        break true;
                    }
                    None => break false,
                }
            }

            _ = cancel_token.cancelled() => break false,
        }
    };

    CLIENT_CONNECTED.store(false, Ordering::SeqCst);
    println!(
        "Client disconnected{}",
        if disconnected_with_error {
            " with error"
        } else {
            ""
        }
    );
}

fn handle_message(content: Utf8Bytes) {
    let data: MessageData = serde_json::from_str(&content).unwrap();

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
}

pub fn stop_server() {
    if let Some(cancel_token) = CANCEL_TOKEN.read().unwrap().as_ref() {
        cancel_token.cancel();
    }
}
