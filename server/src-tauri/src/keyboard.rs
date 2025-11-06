use windows::Win32::UI::Input::KeyboardAndMouse;

pub trait BaseKeyboard {
    fn press(keycode: u8);
}

pub struct WindowsKeyboard;

impl BaseKeyboard for WindowsKeyboard {
    fn press(keycode: u8) {
        unsafe {
            KeyboardAndMouse::keybd_event(
                keycode,
                0,
                KeyboardAndMouse::KEYEVENTF_EXTENDEDKEY,
                0,
            );
            KeyboardAndMouse::keybd_event(
                keycode,
                0,
                KeyboardAndMouse::KEYEVENTF_EXTENDEDKEY | KeyboardAndMouse::KEYEVENTF_KEYUP,
                0,
            );
        }
    }
}
