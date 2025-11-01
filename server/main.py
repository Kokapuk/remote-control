import asyncio
import websockets
import socket
import json
from mouse import Mouse
from win_mouse import WindowsMouse
from keyboard import Keyboard
from win_keyboard import WindowsKeyboard

PORT = 8765
mouse = Mouse(WindowsMouse())
keyboard = Keyboard(WindowsKeyboard())


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
                    mouse.click_left()
                case 'rightClick':
                    mouse.click_right()
                case 'middleClick':
                    mouse.click_middle()
                case 'move':
                    mouse.move(int(data['x']), int(data['y']))
                case 'scroll':
                    mouse.scroll(int(data['x']), int(data['y']))
                case 'leftPress':
                    mouse.press_left()
                case 'leftRelease':
                    mouse.release_left()
                case 'keyboardPress':
                    keyboard.press(data['keycode'])
    finally:
        print('Client disconnected')


async def main():
    local_ip = get_local_ip()

    async with websockets.serve(handler, '0.0.0.0', PORT):
        print(f'Server running at {local_ip}:{PORT}')
        await asyncio.Future()

asyncio.run(main())
