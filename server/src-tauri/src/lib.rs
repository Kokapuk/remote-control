mod keyboard;
mod mouse;
mod server;

use std::sync::OnceLock;
use tauri::AppHandle;

pub static APP_HANDLE: OnceLock<AppHandle> = OnceLock::new();

#[tauri::command]
async fn start_server(port: u16, allow_multiple_connections: bool) {
    server::start_server(port, Some(allow_multiple_connections)).await;
}

#[tauri::command]
fn stop_server() {
    server::stop_server();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .setup(|app| {
            APP_HANDLE.set(app.handle().clone()).unwrap();

            tauri::WebviewWindowBuilder::from_config(app.handle(), &app.config().app.windows[0])
                .unwrap()
                .build()
                .unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
