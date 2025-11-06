use windows::Win32::UI::Input::KeyboardAndMouse;

pub trait BaseKeyboard: Send + Sync {
    fn press(&self, keycode: u8);
}

pub struct WindowsKeyboard;

impl BaseKeyboard for WindowsKeyboard {
    fn press(&self, keycode: u8) {
        unsafe {
            KeyboardAndMouse::keybd_event(keycode, 0, KeyboardAndMouse::KEYEVENTF_EXTENDEDKEY, 0);
            KeyboardAndMouse::keybd_event(
                keycode,
                0,
                KeyboardAndMouse::KEYEVENTF_EXTENDEDKEY | KeyboardAndMouse::KEYEVENTF_KEYUP,
                0,
            );
        }
    }
}

pub struct Keyboard {
    strategy: Box<dyn BaseKeyboard>,
}

impl Keyboard {
    pub fn new(strategy: Box<dyn BaseKeyboard>) -> Self {
        Self { strategy }
    }
}

impl BaseKeyboard for Keyboard {
    fn press(&self, keycode: u8) {
        self.strategy.press(keycode);
    }
}
