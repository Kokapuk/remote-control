import { Box, Stack } from '@chakra-ui/react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import LogPanel from './features/ServerForm/LogPanel';
import ServerForm from './features/ServerForm/ServerForm';

export default function App() {
  useEffect(() => {
    requestAnimationFrame(() => {
      const window = getCurrentWindow();
      window.show();
    });
  }, []);

  return (
    <Box height="100%" padding={{ base: '4', md: '6' }} overflow="auto" scrollbarGutter="stable">
      <Stack height="100%" marginInline="auto" maxWidth="6xl" gap="4">
        <ServerForm />
        <LogPanel />
      </Stack>
    </Box>
  );
}
