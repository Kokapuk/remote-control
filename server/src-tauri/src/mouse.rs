use windows::Win32::UI::Input::KeyboardAndMouse;

pub trait BaseMouse: Sync + Send {
    fn press_left(&self);
    fn release_left(&self);
    fn press_right(&self);
    fn release_right(&self);
    fn press_middle(&self);
    fn release_middle(&self);
    fn click_left(&self);
    fn click_right(&self);
    fn click_middle(&self);
    fn move_relative(&self, x: i32, y: i32);
    fn scroll(&self, x: i32, y: i32);
}

pub struct WindowsMouse;

impl BaseMouse for WindowsMouse {
    fn press_left(&self) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
        }
    }

    fn release_left(&self) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
        }
    }

    fn press_right(&self) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0);
        }
    }

    fn release_right(&self) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0);
        }
    }

    fn press_middle(&self) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_MIDDLEDOWN, 0, 0, 0, 0);
        }
    }

    fn release_middle(&self) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_MIDDLEUP, 0, 0, 0, 0);
        }
    }

    fn click_left(&self) {
        self.press_left();
        self.release_left();
    }

    fn click_right(&self) {
        self.press_right();
        self.release_right();
    }

    fn click_middle(&self) {
        self.press_middle();
        self.release_middle();
    }

    fn move_relative(&self, x: i32, y: i32) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_MOVE, x, y, 0, 0);
        }
    }

    fn scroll(&self, x: i32, y: i32) {
        unsafe {
            KeyboardAndMouse::mouse_event(KeyboardAndMouse::MOUSEEVENTF_WHEEL, 0, 0, y, x as usize);
        }
    }
}

pub struct Mouse {
    strategy: Box<dyn BaseMouse>,
}

impl Mouse {
    pub fn new(strategy: Box<dyn BaseMouse>) -> Self {
        Self { strategy }
    }
}

impl BaseMouse for Mouse {
    fn press_left(&self) {
        self.strategy.press_left();
    }

    fn release_left(&self) {
        self.strategy.release_left();
    }

    fn press_right(&self) {
        self.strategy.press_right();
    }

    fn release_right(&self) {
        self.strategy.release_right();
    }

    fn press_middle(&self) {
        self.strategy.press_middle();
    }

    fn release_middle(&self) {
        self.strategy.release_middle();
    }

    fn click_left(&self) {
        self.strategy.click_left();
    }

    fn click_right(&self) {
        self.strategy.click_right();
    }

    fn click_middle(&self) {
        self.strategy.click_middle();
    }

    fn move_relative(&self, x: i32, y: i32) {
        self.strategy.move_relative(x, y);
    }

    fn scroll(&self, x: i32, y: i32) {
        self.strategy.scroll(x, y);
    }
}
