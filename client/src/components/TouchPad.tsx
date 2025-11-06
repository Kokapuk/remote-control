import useSettingsStore from '@/stores/settings';
import useSocketStore from '@/stores/socket';
import getAcceleratedCoords from '@/utils/getAcceleratedCoords';
import { Box, type BoxProps } from '@chakra-ui/react';
import { type RefAttributes } from 'react';
import { useShallow } from 'zustand/shallow';
import useGestures from '../hooks/useGestures';

export type TouchPadProps = BoxProps & RefAttributes<HTMLDivElement>;

export default function TouchPad(props: TouchPadProps) {
  const socket = useSocketStore((s) => s.socket);

  const { moveSensitivity, scrollSensitivity, accelerationThreshold, maxAccelerationFactor } = useSettingsStore(
    useShallow((s) => ({
      moveSensitivity: s.moveSensitivity,
      scrollSensitivity: s.scrollSensitivity,
      accelerationThreshold: s.accelerationThreshold,
      maxAccelerationFactor: s.maxAccelerationFactor,
    }))
  );

  const bind = useGestures({
    onLeftClick() {
      socket?.send(JSON.stringify({ type: 'leftClick' }));
    },
    onRightClick() {
      socket?.send(JSON.stringify({ type: 'rightClick' }));
    },
    onMiddleClick() {
      socket?.send(JSON.stringify({ type: 'middleClick' }));
    },
    onMove(x, y) {
      const [acceleratedX, acceleratedY] = getAcceleratedCoords(x, y, accelerationThreshold, maxAccelerationFactor);
      socket?.send(
        JSON.stringify({
          type: 'move',
          x: Math.trunc(acceleratedX * moveSensitivity),
          y: Math.trunc(acceleratedY * moveSensitivity),
        })
      );
    },
    onScroll(x, y) {
      socket?.send(
        JSON.stringify({ type: 'scroll', x: Math.trunc(x * scrollSensitivity), y: Math.trunc(y * scrollSensitivity) })
      );
    },
    onLeftPress() {
      socket?.send(JSON.stringify({ type: 'leftPress' }));
    },
    onLeftRelease() {
      socket?.send(JSON.stringify({ type: 'leftRelease' }));
    },
  });

  return (
    <Box
      {...bind}
      touchAction="none"
      backgroundImage="radial-gradient(circle at center, rgba(255, 255, 255, 0.075) 0.075rem, transparent 0.075rem)"
      backgroundSize="1rem 1rem"
      {...props}
    />
  );
}
