import { Button, Card, Field, Input, Stack } from '@chakra-ui/react';
import useSocketStore from '@stores/socket';
import { toaster } from '@ui/toaster';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

export default function ConnectionForm() {
  const [connecting, setConnecting] = useState(false);
  const { setSocket, setHostname } = useSocketStore(
    useShallow((s) => ({ setSocket: s.setSocket, setHostname: s.setHostname }))
  );
  const savedIp = localStorage.getItem('savedIp') ?? undefined;
  const savedPort = localStorage.getItem('savedPort') ?? undefined;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setConnecting(true);

    const formdata = Object.fromEntries(new FormData(event.currentTarget).entries());
    const socket = new WebSocket(`ws://${formdata.ip}:${formdata.port}`);

    const cleanup = () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('error', handleError);
    };

    const handleMessage = (event: MessageEvent<string>) => {
      setHostname(event.data);
      setConnecting(false);
      cleanup();
      toaster.success({ title: 'Connected' });
    };

    const handleOpen = () => {
      setSocket(socket);
      localStorage.setItem('savedIp', formdata.ip as string);
      localStorage.setItem('savedPort', formdata.port as string);
    };

    const handleError = () => {
      toaster.error({ title: 'Failed to connect' });
      setConnecting(false);
      cleanup();
    };

    socket.addEventListener('message', handleMessage);
    socket.addEventListener('open', handleOpen);
    socket.addEventListener('error', handleError);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Card.Root as="form" maxW="sm" marginInline="auto" onSubmit={handleSubmit as any}>
      <Card.Header>
        <Card.Title>Connection</Card.Title>
      </Card.Header>
      <Card.Body>
        <Stack gap="4">
          <Field.Root>
            <Field.Label>IP</Field.Label>
            <Input
              name="ip"
              type="text"
              defaultValue={savedIp}
              required
              pattern="^(?:(?:(?!25?[6-9])[12]\d|[1-9])?\d\.?\b){4}$"
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Port</Field.Label>
            <Input name="port" type="number" defaultValue={savedPort} required min={0} max={65535} />
          </Field.Root>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button type="submit" loading={connecting}>
          Connect
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
