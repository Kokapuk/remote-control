use local_ip_address::local_ip;
use mdns_sd::{ServiceDaemon, ServiceInfo};
use std::collections::HashMap;
use tauri::Manager;

pub async fn start_server(app_handle: tauri::AppHandle) {
    let my_ip = local_ip().unwrap().to_string();
    let host_name = "remote-control.local";
    let port = 3000;

    let mdns = ServiceDaemon::new().expect("Failed to create daemon");
    let service_type = "_http._tcp.local.";
    let instance_name = "remote-control";

    let mut properties = HashMap::new();
    properties.insert("path".to_string(), "/".to_string());

    let service_info = ServiceInfo::new(
        service_type,
        instance_name,
        &format!("{}.", host_name).to_string(),
        &my_ip,
        port,
        Some(properties),
    )
    .expect("valid service info");

    mdns.register(service_info)
        .expect("Failed to register mDNS service");
    println!(
        "Remote frontend is available at http://{}:{}",
        host_name, port
    );

    let resource_path = app_handle
        .path()
        .resolve("remote_frontend", tauri::path::BaseDirectory::Resource)
        .expect("Failed to resolve resource");

    let app =
        axum::Router::new().fallback_service(tower_http::services::ServeDir::new(resource_path));
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
