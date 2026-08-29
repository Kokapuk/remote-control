import { Card, Grid, Separator } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Store } from '@tauri-apps/plugin-store';
import { FormEvent, RefAttributes, useEffect, useState } from 'react';
import ConnectionPanel from './ConnectionPanel';
import ServerSettings from './ServerSettings';

export type ServerFormProps = Card.RootProps & RefAttributes<HTMLFormElement>;

export default function ServerForm(props: ServerFormProps) {
  const [isServerRunning, setServerRunning] = useState(false);
  const [port, setPort] = useState(0);
  const [localIp, setLocalIp] = useState<string | null>(null);
  const [allowMultipleConnections, setAllowMultipleConnections] = useState(false);

  useEffect(() => {
    (async () => setServerRunning(await invoke('is_server_running')))();
    invoke<string>('get_local_ipv4').then(setLocalIp).catch(() => setLocalIp(null));
  }, []);

  useEffect(() => {
    (async () => {
      const store = await Store.load('settings.json');
      const port = await store.get<number>('port');
      const allowMultipleConnections = await store.get<boolean>('allow-multiple-connections');

      setPort(port!);
      setAllowMultipleConnections(allowMultipleConnections!);
    })();
  }, []);

  const toggleServerRunning = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isServerRunning) {
      await invoke('stop_server');
    } else {
      const store = await Store.load('settings.json', { defaults: {}, autoSave: false });
      await store.set('port', port);
      await store.set('allow-multiple-connections', allowMultipleConnections);
      await store.save();

      const options = { port, allowMultipleConnections };
      await invoke('start_server', options);
    }
  };

  useEffect(() => {
    const unlistenServerStart = listen('server-start', () => setServerRunning(true));
    const unlistenServerStop = listen('server-stop', () => setServerRunning(false));

    return () => {
      unlistenServerStart.then((f) => f());
      unlistenServerStop.then((f) => f());
    };
  }, []);

  return (
    <Card.Root as="form" onSubmit={toggleServerRunning as any} {...(props as any)}>
      <Card.Body padding={{ base: '5', md: '6' }}>
        <Grid alignItems="stretch" gap={{ base: '6', md: '8' }} templateColumns={{ base: '1fr', md: '1fr auto 1fr' }}>
          <ServerSettings
            allowMultipleConnections={allowMultipleConnections}
            isServerRunning={isServerRunning}
            onAllowMultipleConnectionsChange={setAllowMultipleConnections}
            onPortChange={setPort}
            port={port}
          />
          <Separator display={{ base: 'none', md: 'block' }} orientation="vertical" />
          <ConnectionPanel ip={localIp} port={port} />
        </Grid>
      </Card.Body>
    </Card.Root>
  );
}
