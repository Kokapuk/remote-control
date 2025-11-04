from mouse import MouseBase
import win32api
import win32con


class WindowsMouse(MouseBase):
    def press_left(self):
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTDOWN, 0, 0)

    def release_left(self):
        win32api.mouse_event(win32con.MOUSEEVENTF_LEFTUP, 0, 0)

    def press_right(self):
        win32api.mouse_event(win32con.MOUSEEVENTF_RIGHTDOWN, 0, 0)

    def release_right(self):
        win32api.mouse_event(win32con.MOUSEEVENTF_RIGHTUP, 0, 0)

    def press_middle(self):
        win32api.mouse_event(win32con.MOUSEEVENTF_MIDDLEDOWN, 0, 0)

    def release_middle(self):
        win32api.mouse_event(win32con.MOUSEEVENTF_MIDDLEUP, 0, 0)

    def click_left(self):
        self.press_left()
        self.release_left()

    def click_right(self):
        self.press_right()
        self.release_right()

    def click_middle(self):
        self.press_middle()
        self.release_middle()

    def move(self, x, y):
        win32api.mouse_event(win32con.MOUSEEVENTF_MOVE, x, y)

    def scroll(self, x, y):
        win32api.mouse_event(win32con.MOUSEEVENTF_WHEEL, 0, 0, y, x)
