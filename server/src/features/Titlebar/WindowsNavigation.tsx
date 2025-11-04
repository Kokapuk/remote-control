import ChromeClose from '@/features/Titlebar/ChromeClose';
import ChromeMinimize from '@/features/Titlebar/ChromeMinimize';
import { Stack } from '@chakra-ui/react';
import WindowsNavigationButton from './WindowsNavigationButton';
import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();

export default function WindowsNavigation() {
  return (
    <Stack as="nav" direction="row" marginLeft="auto" gap="0" width="fit-content" height="100%">
      <WindowsNavigationButton onClick={() => appWindow.minimize()} height="100%" tooltip="Minimize">
        <ChromeMinimize />
      </WindowsNavigationButton>
      <WindowsNavigationButton onClick={() => appWindow.close()} variant="close" height="100%" tooltip="Close">
        <ChromeClose />
      </WindowsNavigationButton>
    </Stack>
  );
}
