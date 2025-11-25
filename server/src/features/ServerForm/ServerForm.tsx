import { Switch } from '@/ui/switch';
import { Button, Card, Field, NumberInput, Stack } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { Store } from '@tauri-apps/plugin-store';
import { FormEvent, RefAttributes, useEffect, useState } from 'react';
import LogPanel from './LogPanel';

export type ServerFormProps = Card.RootProps & RefAttributes<HTMLFormElement>;

export default function ServerForm(props: ServerFormProps) {
  const [isServerRunning, setServerRunning] = useState(false);
  const [port, setPort] = useState(0);
  const [allowMultipleConnections, setAllowMultipleConnections] = useState(false);

  useEffect(() => {
    (async () => setServerRunning(await invoke('is_server_running')))();
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
      <Card.Header>
        <Card.Title>Server</Card.Title>
      </Card.Header>

      <Card.Body>
        <Stack gap="4">
          <Field.Root>
            <Field.Label>Port</Field.Label>
            <NumberInput.Root
              required
              readOnly={isServerRunning}
              value={port.toString()}
              onValueChange={(e) => setPort(e.valueAsNumber)}
              name="port"
              min={1}
              max={65535}
              width="100%"
            >
              <NumberInput.Control />
              <NumberInput.Input />
            </NumberInput.Root>
          </Field.Root>

          <Field.Root>
            <Field.Label>Allow multiple connections</Field.Label>
            <Switch
              checked={allowMultipleConnections}
              onCheckedChange={(e) => setAllowMultipleConnections(e.checked)}
              name="allowMultipleConnections"
              disabled={isServerRunning}
              size="lg"
            />
          </Field.Root>
        </Stack>
      </Card.Body>

      <Card.Footer flexDirection="column" minHeight="0">
        <Button type="submit" colorPalette={isServerRunning ? 'red' : undefined} alignSelf="flex-end">
          {isServerRunning ? 'Stop' : 'Start'}
        </Button>

        <LogPanel alignSelf="flex-start" width="100%" />
      </Card.Footer>
    </Card.Root>
  );
}
