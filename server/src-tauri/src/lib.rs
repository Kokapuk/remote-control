mod server;

#[tauri::command]
async fn start_server(port: u16) {
    server::start_server(port).await;
}

#[tauri::command]
fn stop_server() {
    server::stop_server();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_server, stop_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
