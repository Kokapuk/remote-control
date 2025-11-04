from keyboard import KeyboardBase
import win32api
import win32con


class WindowsKeyboard(KeyboardBase):
    def press(self, keycode):
        win32api.keybd_event(keycode, 0, 0, 0)
        win32api.keybd_event(keycode, 0, win32con.KEYEVENTF_KEYUP, 0)
