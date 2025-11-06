use crate::keyboard::{BaseKeyboard, WindowsKeyboard};
use crate::mouse::{BaseMouse, WindowsMouse};
use futures::{SinkExt, StreamExt};
use gethostname::gethostname;
use serde::Deserialize;
use std::sync::{
    Arc, RwLock,
    atomic::{AtomicBool, Ordering},
};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{
    accept_async,
    tungstenite::{
        Utf8Bytes,
        protocol::{CloseFrame, Message},
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

static CANCEL_TOKEN: RwLock<Option<CancellationToken>> = RwLock::new(None);
static CLIENT_CONNECTED: RwLock<Option<Arc<std::sync::atomic::AtomicBool>>> = RwLock::new(None);

pub async fn start_server(port: u16) {
    let listener = TcpListener::bind(format!("0.0.0.0:{port}"))
        .await
        .expect("Failed to bind");

    let mut c = CLIENT_CONNECTED.write().unwrap();
    *c = Some(Arc::new(std::sync::atomic::AtomicBool::new(false)));

    tauri::async_runtime::spawn(handle_server_running(listener));
    println!("Server started");
}

async fn handle_server_running(listener: TcpListener) {
    let cancel = CancellationToken::new();
    {
        let mut t = CANCEL_TOKEN.write().unwrap();
        *t = Some(cancel.clone());
    }

    loop {
        tokio::select! {
            accept_result = listener.accept() => {
                match accept_result {
                    Ok((stream, _)) => {
                        let child = cancel.child_token();
                        tauri::async_runtime::spawn(handle_new_connection(stream, child));
                    }
                    Err(e) => {
                        println!("Accept error: {}", e);
                    }
                }
            }

            _ = cancel.cancelled() => {
                break;
            }
        }
    }

    println!("Server stopped");
}

async fn handle_new_connection(stream: TcpStream, cancel: CancellationToken) {
    let connected_flag = CLIENT_CONNECTED.read().unwrap().as_ref().unwrap().clone();

    if connected_flag.swap(true, Ordering::SeqCst) {
        println!("Client rejected");

        if let Ok(mut ws) = accept_async(stream).await {
            let _ = ws
                .close(Some(CloseFrame {
                    code: tokio_tungstenite::tungstenite::protocol::frame::coding::CloseCode::Error,
                    reason: "Server already has active connection".into(),
                }))
                .await;
        }

        return;
    }

    handle_connection(stream, cancel, connected_flag).await;
}

async fn handle_connection(
    stream: TcpStream,
    cancel: CancellationToken,
    connected_flag: Arc<AtomicBool>,
) {
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            println!("Handshake error: {}", e);
            connected_flag.store(false, Ordering::SeqCst);
            return;
        }
    };

    let (mut sender, mut receiver) = ws_stream.split();

    sender
        .send(Message::Text(gethostname().into_string().unwrap().into()))
        .await
        .expect("Handshake failed");
    println!("Client connected");

    loop {
        tokio::select! {
            msg = receiver.next() => {
                match msg {
                    Some(Ok(Message::Text(content))) => {
                        handle_message(content);
                    }
                    Some(Ok(Message::Close(_))) => {
                        break;
                    }
                    Some(Ok(_)) => (),
                    Some(Err(e)) => {
                        println!("Error: {}", e);
                        break;
                    }
                    None => break,
                }
            }

            _ = cancel.cancelled() => {
                break;
            }
        }
    }

    connected_flag.store(false, Ordering::SeqCst);
    println!("Client disconnected");
}

fn handle_message(content: Utf8Bytes) {
    let data: MessageData = serde_json::from_str(&content).unwrap();

    match data {
        MessageData::LeftClick => {
            WindowsMouse::click_left();
        }

        MessageData::RightClick => {
            WindowsMouse::click_right();
        }

        MessageData::MiddleClick => {
            WindowsMouse::click_middle();
        }

        MessageData::LeftPress => {
            WindowsMouse::press_left();
        }

        MessageData::LeftRelease => {
            WindowsMouse::release_left();
        }

        MessageData::Move { x, y } => {
            WindowsMouse::move_relative(x, y);
        }

        MessageData::Scroll { x, y } => {
            WindowsMouse::scroll(x, y);
        }

        MessageData::KeyboardPress { keycode } => {
            WindowsKeyboard::press(keycode);
        }
    }
}

pub fn stop_server() {
    if let Some(token) = CANCEL_TOKEN.read().unwrap().as_ref() {
        token.cancel();
    } else {
        println!("Server is not running");
    }
}
