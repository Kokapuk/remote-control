import { Box, type BoxProps } from '@chakra-ui/react';
import useSocketStore from '@stores/socket';
import { type RefAttributes } from 'react';
import useGestures from '../hooks/useGestures';
import useSettingsStore from '@stores/settings';
import { useShallow } from 'zustand/shallow';

export type TouchPadProps = BoxProps & RefAttributes<HTMLDivElement>;

export default function TouchPad(props: TouchPadProps) {
  const socket = useSocketStore((s) => s.socket);

  const { moveSensitivity, scrollSensitivity } = useSettingsStore(
    useShallow((s) => ({ moveSensitivity: s.moveSensitivity, scrollSensitivity: s.scrollSensitivity }))
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
      socket?.send(JSON.stringify({ type: 'move', x: x * moveSensitivity, y: y * moveSensitivity }));
    },
    onScroll(x, y) {
      socket?.send(JSON.stringify({ type: 'scroll', x: x * scrollSensitivity, y: y * scrollSensitivity }));
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
