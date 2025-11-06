use windows::Win32::UI::Input::KeyboardAndMouse;

pub trait BaseMouse {
    fn press_left();
    fn release_left();
    fn press_right();
    fn release_right();
    fn press_middle();
    fn release_middle();
    fn click_left();
    fn click_right();
    fn click_middle();
    fn move_relative(x: i32, y: i32);
    fn scroll(x: i32, y: i32);
}

pub struct WindowsMouse;

impl BaseMouse for WindowsMouse {
    fn press_left() {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
        }
    }

    fn release_left() {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
        }
    }

    fn press_right() {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0);
        }
    }

    fn release_right() {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0);
        }
    }

    fn press_middle() {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_MIDDLEDOWN, 0, 0, 0, 0);
        }
    }

    fn release_middle() {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_MIDDLEUP, 0, 0, 0, 0);
        }
    }

    fn click_left() {
        WindowsMouse::press_left();
        WindowsMouse::release_left();
    }

    fn click_right() {
        WindowsMouse::press_right();
        WindowsMouse::release_right();
    }

    fn click_middle() {
        WindowsMouse::press_middle();
        WindowsMouse::release_middle();
    }

    fn move_relative(x: i32, y: i32) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_MOVE, x, y, 0, 0);
        }
    }

    fn scroll(x: i32, y: i32) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_WHEEL, 0, 0, y, x as usize);
        }
    }
}
