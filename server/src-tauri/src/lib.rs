mod keyboard;
mod mouse;
mod server;

use crate::server::ServerEvent;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{
    App, AppHandle, Emitter, Manager, RunEvent, WebviewWindow, WebviewWindowBuilder,
    image::Image,
    menu::{IconMenuItemBuilder, MenuBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use tauri_plugin_notification::NotificationExt;

static ALLOW_EXIT: AtomicBool = AtomicBool::new(false);

#[tauri::command]
async fn start_server(port: u16, allow_multiple_connections: bool) {
    server::start_server(port, Some(allow_multiple_connections)).await;
}

#[tauri::command]
fn stop_server() {
    server::stop_server();
}

#[tauri::command]
fn is_server_running() -> bool {
    server::is_server_running()
}

fn create_main_window(app: &AppHandle) -> WebviewWindow {
    WebviewWindowBuilder::from_config(app, &app.config().app.windows[0])
        .unwrap()
        .build()
        .unwrap()
}

fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        window.unminimize().unwrap();
        window.set_focus().unwrap();

        return;
    }

    let window = create_main_window(app);
    window.set_focus().unwrap();
}

fn initialize_tray(app: &App) {
    let title_menu_item = IconMenuItemBuilder::new("Remote Control")
        .id("title")
        .icon(Image::from_bytes(include_bytes!("../icons/tray.png")).unwrap())
        .enabled(false)
        .build(app)
        .unwrap();

    let menu = MenuBuilder::new(app)
        .item(&title_menu_item)
        .separator()
        .text("show", "Show")
        .separator()
        .text("quit", "Quit")
        .build()
        .unwrap();

    TrayIconBuilder::new()
        .icon(Image::from_bytes(include_bytes!("../icons/tray.png")).unwrap())
        .tooltip("Remote Control")
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } => {
                show_main_window(&tray.app_handle());
            }
            _ => {}
        })
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                show_main_window(&app);
            }
            "quit" => {
                ALLOW_EXIT.store(true, Ordering::SeqCst);
                app.exit(0);
            }
            _ => {}
        })
        .build(app)
        .unwrap();
}

fn setup_server_events(app: &AppHandle) {
    {
        let app = app.clone();
        server::add_event_listener(ServerEvent::Start, move || {
            app.emit("server-start", ()).unwrap()
        });
    }
    {
        let app = app.clone();
        server::add_event_listener(ServerEvent::Stop, move || {
            app.emit("server-stop", ()).unwrap()
        });
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            start_server,
            stop_server,
            is_server_running
        ])
        .setup(|app| {
            initialize_tray(app);
            setup_server_events(app.app_handle());

            app.notification()
                .builder()
                .title("Remote Control")
                .body("App is running in background")
                .show()
                .unwrap();

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
