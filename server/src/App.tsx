import { Button } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/core';
import { useState } from 'react';

export default function App() {
  const [isServerRunning, setServerRunning] = useState(false);

  const handleClick = async () => {
    if (isServerRunning) {
      await invoke('stop_server');
      setServerRunning(false);
    } else {
      await invoke('start_server', { port: 8765 });
      setServerRunning(true);
    }
  };

  return <Button onClick={handleClick}>{isServerRunning ? 'Stop' : 'Start'}</Button>;
}
