import debounce from 'lodash/debounce';
import { useRef } from 'react';

const START_DELAY = 50;
const DRAG_DELAY = 300;

const useGestures = ({
  onLeftClick,
  onRightClick,
  onMiddleClick,
  onMove,
  onScroll,
  onLeftPress,
  onLeftRelease,
}: {
  onLeftClick(): void;
  onRightClick(): void;
  onMiddleClick(): void;
  onMove(x: number, y: number): void;
  onScroll(x: number, y: number): void;
  onLeftPress(): void;
  onLeftRelease(): void;
}) => {
  const startTouches = useRef<React.Touch[]>(null);
  const prevTouches = useRef<React.Touch[]>(null);
  const started = useRef(false);
  const isPanGesture = useRef(false);
  const isDragGesture = useRef(false);

  const startTimeout = useRef(
    debounce(() => {
      started.current = true;
    }, START_DELAY)
  );

  const dragTimeout = useRef(
    debounce(() => {
      isDragGesture.current = true;
      onLeftPress();
      navigator.vibrate(30);
    }, DRAG_DELAY)
  );

  const reset = () => {
    startTouches.current = null;
    prevTouches.current = null;
    started.current = false;
    startTimeout.current.cancel();
    isPanGesture.current = false;
    isDragGesture.current = false;
    dragTimeout.current.cancel();
  };

  return {
    onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => {
      startTouches.current = Array.from(event.touches);
      prevTouches.current = startTouches.current;

      startTimeout.current();
      dragTimeout.current();
    },

    onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => {
      if (!started.current) {
        return;
      }

      dragTimeout.current.cancel();

      if (!isPanGesture.current) {
        isPanGesture.current = true;

        prevTouches.current = Array.from(event.touches);
      }

      const movementX = event.touches[0].screenX - prevTouches.current![0].screenX;
      const movementY = event.touches[0].screenY - prevTouches.current![0].screenY;

      switch (prevTouches.current!.length) {
        case 1:
          onMove(movementX, movementY);
          break;
        case 2:
          onScroll(movementX, movementY);
          break;
      }

      prevTouches.current = Array.from(event.touches);
    },

    onTouchEnd: () => {
      if (!isPanGesture.current) {
        switch (startTouches.current?.length) {
          case 1:
            onLeftClick();
            break;
          case 2:
            onRightClick();
            break;
          case 3:
            onMiddleClick();
            break;
        }
      }

      if (isDragGesture.current) {
        onLeftRelease();
      }

      reset();
    },

    onTouchCancel: reset,
  };
};

export default useGestures;
