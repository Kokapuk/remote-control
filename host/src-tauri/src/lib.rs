mod keyboard;
mod mouse;
mod remote_frontend;
mod server;

use crate::server::ServerEvent;
use std::{
    collections::VecDeque,
    sync::{
        LazyLock, RwLock,
        atomic::{AtomicBool, Ordering},
    },
};
use tauri::{
    App, AppHandle, Emitter, Manager, RunEvent, WebviewWindow, WebviewWindowBuilder,
    image::Image,
    menu::{IconMenuItemBuilder, MenuBuilder, MenuItemBuilder},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};
use tauri_plugin_autostart::ManagerExt;
use tauri_plugin_notification::NotificationExt;
use tauri_plugin_store::StoreExt;

static ALLOW_EXIT: AtomicBool = AtomicBool::new(false);
const MAX_LOGS: usize = 256;
static LOGS: LazyLock<RwLock<VecDeque<String>>> = LazyLock::new(|| RwLock::new(VecDeque::new()));

#[tauri::command]
async fn start_server(app_handle: AppHandle) {
    let store = app_handle.store("settings.json").unwrap();
    let port = store.get("port").unwrap().as_u64().unwrap();
    let allow_multiple_connections = store
        .get("allow-multiple-connections")
        .unwrap()
        .as_bool()
        .unwrap();

    server::start_server(port as u16, Some(allow_multiple_connections)).await;
}

#[tauri::command]
fn stop_server() {
    server::stop_server();
}

#[tauri::command]
fn is_server_running() -> bool {
    server::is_server_running()
}

#[tauri::command]
fn get_logs() -> VecDeque<String> {
    LOGS.read().unwrap().clone()
}

fn fill_settings_defaults(app: &App) {
    let store = app.store("settings.json").unwrap();

    if !store.has("port") {
        store.set("port", 8765);
    }

    if !store.has("allow-multiple-connections") {
        store.set("allow-multiple-connections", false);
    }
}

fn create_main_window(app: &AppHandle) -> WebviewWindow {
    WebviewWindowBuilder::from_config(app, &app.config().app.windows[0])
        .unwrap()
        .build()
        .unwrap()
}

fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        window.show().unwrap();
        window.unminimize().unwrap();
        window.set_focus().unwrap();

        return;
    }

    let window = create_main_window(app);
    window.show().unwrap();
    window.set_focus().unwrap();
}

fn initialize_tray(app: &App) {
    let title_menu_item = IconMenuItemBuilder::new("Remote Control")
        .id("title")
        .icon(Image::from_bytes(include_bytes!("../icons/Monochrome.png")).unwrap())
        .enabled(false)
        .build(app)
        .unwrap();

    let toggle_server_menu_item = MenuItemBuilder::new("Start Server")
        .id("toggle-server")
        .build(app)
        .unwrap();

    let menu = MenuBuilder::new(app)
        .item(&title_menu_item)
        .separator()
        .text("show", "Show")
        .item(&toggle_server_menu_item)
        .separator()
        .text("quit", "Quit")
        .build()
        .unwrap();

    let tray_icon = TrayIconBuilder::new()
        .icon(Image::from_bytes(include_bytes!("../icons/TrayInactive.png")).unwrap())
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
            "toggle-server" => {
                if is_server_running() {
                    stop_server();
                } else {
                    tauri::async_runtime::spawn(start_server(app.clone()));
                }
            }
            "quit" => {
                ALLOW_EXIT.store(true, Ordering::SeqCst);
                app.exit(0);
            }
            _ => {}
        })
        .build(app)
        .unwrap();

    let server_event_callback = move |event: &ServerEvent| match event {
        ServerEvent::Start => {
            tray_icon
                .set_icon(Image::from_bytes(include_bytes!("../icons/TrayActive.png")).ok())
                .unwrap();

            toggle_server_menu_item.set_text("Stop Server").unwrap();
        }
        ServerEvent::Stop => {
            tray_icon
                .set_icon(Image::from_bytes(include_bytes!("../icons/TrayInactive.png")).ok())
                .unwrap();

            toggle_server_menu_item.set_text("Start Server").unwrap();
        }
        _ => {}
    };

    server::add_event_listener(Box::new(server_event_callback));
}

pub(crate) fn log(app: &AppHandle, message: &String) {
    let mut logs = LOGS.write().unwrap();

    if logs.len() >= MAX_LOGS {
        logs.pop_front();
    }

    logs.push_back(message.clone());

    app.emit("log", message).unwrap();
}

fn setup_server_events(app: &AppHandle) {
    let app = app.clone();
    let callback = move |event: &ServerEvent| match event {
        ServerEvent::Start => app.emit("server-start", ()).unwrap(),
        ServerEvent::Stop => app.emit("server-stop", ()).unwrap(),
        ServerEvent::Log { message } => log(&app, message),
    };

    server::add_event_listener(Box::new(callback));
}

fn enable_autostart(app: &AppHandle) {
    if cfg!(dev) {
        log(&app, &"Skipped enabling autostart".to_string());
        return;
    }

    match app.autolaunch().enable() {
        Ok(_) => log(&app, &"Enabled autostart".to_string()),
        Err(e) => log(&app, &e.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_prevent_default::debug())
        .invoke_handler(tauri::generate_handler![
            start_server,
            stop_server,
            is_server_running,
            get_logs
        ])
        .setup(|app| {
            fill_settings_defaults(app);
            initialize_tray(app);
            setup_server_events(app.app_handle());

            app.notification()
                .builder()
                .title("Remote Control")
                .body("App is running in background")
                .show()
                .unwrap();

            tauri::async_runtime::spawn(start_server(app.app_handle().clone()));
            enable_autostart(app.app_handle());

            tauri::async_runtime::spawn(remote_frontend::start_server(app.app_handle().clone()));

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
