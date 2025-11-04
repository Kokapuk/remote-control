from abc import ABC, abstractmethod


class MouseBase(ABC):
    @abstractmethod
    def press_left(self): ...

    @abstractmethod
    def release_left(self): ...

    @abstractmethod
    def press_right(self): ...

    @abstractmethod
    def release_right(self): ...

    @abstractmethod
    def press_middle(self): ...

    @abstractmethod
    def release_middle(self): ...

    @abstractmethod
    def click_left(self): ...

    @abstractmethod
    def click_right(self): ...

    @abstractmethod
    def click_middle(self): ...

    @abstractmethod
    def move(self, x, y): ...

    @abstractmethod
    def scroll(self, x, y): ...


class Mouse(MouseBase):
    def __init__(self, strategy: MouseBase):
        self._impl = strategy

    def press_left(self):
        self._impl.press_left()

    def release_left(self):
        self._impl.release_left()

    def press_right(self):
        self._impl.press_right()

    def release_right(self):
        self._impl.release_right()

    def press_middle(self):
        self._impl.press_middle()

    def release_middle(self):
        self._impl.release_middle()

    def click_left(self):
        self._impl.click_left()

    def click_right(self):
        self._impl.click_right()

    def click_middle(self):
        self._impl.click_middle()

    def move(self, x, y):
        self._impl.move(x, y)

    def scroll(self, x, y):
        self._impl.scroll(x, y)
