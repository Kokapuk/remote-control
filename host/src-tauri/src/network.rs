use std::io;
use std::net::{Ipv4Addr, SocketAddr, UdpSocket};

pub fn local_ipv4() -> io::Result<Ipv4Addr> {
    let socket = UdpSocket::bind((Ipv4Addr::UNSPECIFIED, 0))?;
    socket.connect((Ipv4Addr::new(1, 1, 1, 1), 80))?;

    match socket.local_addr()? {
        SocketAddr::V4(address) => Ok(*address.ip()),
        SocketAddr::V6(_) => unreachable!("socket was bound as IPv4"),
    }
}
