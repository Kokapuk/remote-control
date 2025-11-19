mod keyboard;
mod mouse;
mod server;

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::OnceLock;
use tauri::{
    menu::MenuBuilder, tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent}, Manager,
    RunEvent,
    WebviewWindowBuilder,
};

pub static APP_HANDLE: OnceLock<tauri::AppHandle> = OnceLock::new();
static ALLOW_EXIT: AtomicBool = AtomicBool::new(false);

#[tauri::command]
async fn start_server(port: u16, allow_multiple_connections: bool) {
    server::start_server(port, Some(allow_multiple_connections)).await;
}

#[tauri::command]
fn stop_server() {
    server::stop_server();
}

fn initialize_tray(app: &tauri::App) {
    let menu = MenuBuilder::new(app).text("quit", "Quit").build().unwrap();

    TrayIconBuilder::new()
        .icon(app.default_window_icon().unwrap().clone())
        .tooltip("Remote Control")
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } => {
                let app = tray.app_handle();

                if let Some(window) = app.get_webview_window("main") {
                    window.unminimize().unwrap();
                    window.set_focus().unwrap();

                    return;
                }

                let window = WebviewWindowBuilder::from_config(app, &app.config().app.windows[0])
                    .unwrap()
                    .build()
                    .unwrap();

                window.set_focus().unwrap();
            }
            _ => {}
        })
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                ALLOW_EXIT.store(true, Ordering::SeqCst);
                app.exit(0);
            }
            _ => {}
        })
        .build(app)
        .unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .setup(|app| {
            APP_HANDLE.set(app.handle().clone()).unwrap();

            initialize_tray(app);

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app, event| match event {
            RunEvent::ExitRequested { api, .. } => {
                if !ALLOW_EXIT.load(Ordering::SeqCst) {
                    api.prevent_exit();
                }
            }
            _ => {}
        });
}
