use mdns_sd::{ServiceDaemon, ServiceInfo};
use std::collections::HashMap;
use std::io;
use std::net::{Ipv4Addr, SocketAddr, UdpSocket};
use tauri::Manager;

fn internet_ipv4() -> io::Result<Ipv4Addr> {
    let socket = UdpSocket::bind((Ipv4Addr::UNSPECIFIED, 0))?;

    socket.connect((Ipv4Addr::new(1, 1, 1, 1), 80))?;

    match socket.local_addr()? {
        SocketAddr::V4(address) => Ok(*address.ip()),
        SocketAddr::V6(_) => unreachable!("socket was bound as IPv4"),
    }
}

pub async fn start_server(app_handle: tauri::AppHandle) {
    let local_ip = internet_ipv4()
        .expect("No IPv4 route to the internet")
        .to_string();
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
        &local_ip,
        port,
        Some(properties),
    )
    .expect("valid service info");

    mdns.register(service_info)
        .expect("Failed to register mDNS service");
    crate::log(
        &app_handle,
        &format!("Remote frontend is available at http://{host_name}:{port}"),
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
