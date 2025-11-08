import { Switch } from '@/ui/switch';
import { Button, Card, Field, NumberInput, Stack } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/core';
import { FormEvent, useEffect, useState } from 'react';

export default function ServerForm() {
  const [isServerRunning, setServerRunning] = useState(false);
  const [port, setPort] = useState(8765);
  const [allowMultipleConnections, setAllowMultipleConnections] = useState(false);

  useEffect(() => {
    const options = JSON.parse(localStorage.getItem('savedOptions') ?? 'null');

    if (!options) {
      return;
    }

    setPort(options.port);
    setAllowMultipleConnections(options.allowMultipleConnections);
  }, []);

  const toggleServerRunning = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isServerRunning) {
      await invoke('stop_server');
      setServerRunning(false);
    } else {
      const options = { port, allowMultipleConnections };

      await invoke('start_server', options);
      setServerRunning(true);

      localStorage.setItem('savedOptions', JSON.stringify(options));
    }
  };

  return (
    <Card.Root as="form" onSubmit={toggleServerRunning as any} width="sm" marginInline="auto" marginTop="16">
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

      <Card.Footer justifyContent="flex-end">
        <Button type="submit" colorPalette={isServerRunning ? 'red' : undefined}>
          {isServerRunning ? 'Stop' : 'Start'}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
