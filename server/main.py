import asyncio
import websockets
import socket
import json
from pynput.mouse import Button, Controller


PORT = 8765

mouse = Controller()


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip


async def handler(websocket):
    print('Client connected')

    try:
        await websocket.send(socket.gethostname())

        async for message in websocket:
            data = json.loads(message)

            match data['type']:
                case 'leftClick':
                    mouse.click(Button.left)
                case 'rightClick':
                    mouse.click(Button.right)
                case 'middleClick':
                    mouse.click(Button.middle)
                case 'move':
                    mouse.move(data['x'], data['y'])
                case 'scroll':
                    mouse.scroll(data['x'], data['y'])
                case 'leftPress':
                    mouse.press(Button.left)
                case 'leftRelease':
                    mouse.release(Button.left)
    finally:
        print('Client disconnected')


async def main():
    local_ip = get_local_ip()

    async with websockets.serve(handler, '0.0.0.0', PORT):
        print(f'Server running at {local_ip}:{PORT}')
        await asyncio.Future()

asyncio.run(main())
