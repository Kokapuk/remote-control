import { getCurrentWindow } from '@tauri-apps/api/window';
import { useEffect } from 'react';
import ServerForm from './features/ServerForm/ServerForm';
import Versions from './features/ServerForm/Version';

export default function App() {
  useEffect(() => {
    requestAnimationFrame(() => {
      const window = getCurrentWindow();
      window.show();
    });
  }, []);

  return (
    <>
      <ServerForm width="sm" marginInline="auto" marginTop="16" maxHeight="calc(100% - 8rem)" />
      <Versions position="absolute" left="2" bottom="2" />
    </>
  );
}
