from abc import ABC, abstractmethod


class KeyboardBase(ABC):
    @abstractmethod
    def press(self, keycode): ...


class Keyboard(KeyboardBase):
    def __init__(self, strategy: KeyboardBase):
        self._impl = strategy

    def press(self, keycode):
        self._impl.press(keycode)
