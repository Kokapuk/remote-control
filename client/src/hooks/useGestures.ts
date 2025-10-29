import { useRef } from 'react';

const START_DELAY = 50;

const useGestures = ({
  onMove,
  onScroll,
  onLeftClick,
  onRightClick,
  onMiddleClick,
}: {
  onMove(x: number, y: number): void;
  onScroll(x: number, y: number): void;
  onLeftClick(): void;
  onRightClick(): void;
  onMiddleClick(): void;
}) => {
  const startTouches = useRef<React.Touch[]>(null);
  const prevTouches = useRef<React.Touch[]>(null);
  const started = useRef(false);
  const startTimeout = useRef<number>(null);
  const isPanGesture = useRef(false);

  const reset = () => {
    startTouches.current = null;
    prevTouches.current = null;
    started.current = false;

    if (startTimeout.current) {
      clearTimeout(startTimeout.current);
    }

    startTimeout.current = null;
    isPanGesture.current = false;
  };

  return {
    onTouchStart: (event: React.TouchEvent<HTMLDivElement>) => {
      startTouches.current = Array.from(event.touches);
      prevTouches.current = startTouches.current;

      if (startTimeout.current) {
        clearTimeout(startTimeout.current);
      }

      startTimeout.current = setTimeout(() => (started.current = true), START_DELAY);
    },

    onTouchMove: (event: React.TouchEvent<HTMLDivElement>) => {
      if (!prevTouches.current || !started.current) {
        return;
      }

      isPanGesture.current = true;

      const movementX = event.touches[0].screenX - prevTouches.current[0].screenX;
      const movementY = event.touches[0].screenY - prevTouches.current[0].screenY;

      switch (prevTouches.current?.length) {
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

      reset();
    },
    onTouchCancel: reset,
  };
};

export default useGestures;
