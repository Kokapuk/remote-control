import asyncio
import websockets
import socket

PORT = 8765


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


async def handler(websocket):
    print("Client connected")

    try:
        await websocket.send(socket.gethostname())

        async for message in websocket:
            print(f"[MESSAGE]: {message}")
    except Exception as e:
        print(f"Connection error: {e}")
    finally:
        print("Client disconnected")


async def main():
    local_ip = get_local_ip()

    async with websockets.serve(handler, "0.0.0.0", PORT):
        print(f"Server running at {local_ip}:{PORT}")
        await asyncio.Future()

asyncio.run(main())
