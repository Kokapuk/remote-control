import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import useGestures from '../hooks/useGestures';

export default function TouchPad() {
  const [log, setLog] = useState('');

  const bind = useGestures({
    onMove(x, y) {
      setLog(`Move: ${x} ${y}`);
    },
    onScroll(x, y) {
      setLog(`Scroll: ${x} ${y}`);
    },
    onLeftClick() {
      setLog('Left click');
    },
    onRightClick() {
      setLog('Right click');
    },
    onMiddleClick() {
      setLog('Middle click');
    },
  });

  return (
    <Box {...bind} touchAction="none" position="absolute" inset="0">
      {log}
    </Box>
  );
}
