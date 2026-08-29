import ChromeClose from '@/features/Layout/ChromeClose';
import ChromeMaximize from '@/features/Layout/ChromeMaximize';
import ChromeMinimize from '@/features/Layout/ChromeMinimize';
import ChromeRestore from '@/features/Layout/ChromeRestore';
import { Stack } from '@chakra-ui/react';
import WindowsNavigationButton from './WindowsNavigationButton';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect, useState } from 'react';

const appWindow = getCurrentWindow();

export default function WindowsNavigation() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const updateMaximizedState = async () => setIsMaximized(await appWindow.isMaximized());
    void updateMaximizedState();

    let unlisten: (() => void) | undefined;
     appWindow.onResized(updateMaximizedState).then((stopListening) => {
      unlisten = stopListening;
    });

    return () => unlisten?.();
  }, []);

  const toggleMaximize = async () => {
    await appWindow.toggleMaximize();
  };

  return (
    <Stack as="nav" direction="row" marginLeft="auto" gap="0" width="fit-content" height="100%">
      <WindowsNavigationButton onClick={() => appWindow.minimize()} height="100%" tooltip="Minimize">
        <ChromeMinimize />
      </WindowsNavigationButton>
      <WindowsNavigationButton onClick={toggleMaximize} height="100%" tooltip={isMaximized ? 'Restore' : 'Maximize'}>
        {isMaximized ? <ChromeRestore /> : <ChromeMaximize />}
      </WindowsNavigationButton>
      <WindowsNavigationButton onClick={() => appWindow.close()} variant="close" height="100%" tooltip="Close">
        <ChromeClose />
      </WindowsNavigationButton>
    </Stack>
  );
}
