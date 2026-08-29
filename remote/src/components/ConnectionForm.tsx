import useSocketStore from '@/stores/socket';
import { toaster } from '@/ui/toaster';
import { isValidIpv4, isValidPort } from '@/utils/validation';
import { Button, Card, Field, Input, NumberInput, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useShallow } from 'zustand/shallow';

export default function ConnectionForm() {
  const [connecting, setConnecting] = useState(false);
  const { setSocket, setHostname } = useSocketStore(
    useShallow((s) => ({ setSocket: s.setSocket, setHostname: s.setHostname })),
  );
  const query = new URLSearchParams(location.search);
  const queryIp = query.get('ip');
  const savedIp = localStorage.getItem('savedIp');
  const initialIp =
    queryIp && isValidIpv4(queryIp) ? queryIp : savedIp && isValidIpv4(savedIp) ? savedIp : '';
  const queryPort = query.get('port');
  const savedPort = localStorage.getItem('savedPort');
  const initialPort = isValidPort(queryPort)
    ? queryPort
    : isValidPort(savedPort)
      ? savedPort
      : '8765';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formdata = Object.fromEntries(new FormData(event.currentTarget).entries());
    const ip = String(formdata.ip).trim();
    const port = String(formdata.port);

    if (!isValidIpv4(ip)) {
      toaster.error({ title: 'Enter a valid IPv4 address' });
      return;
    }

    if (!isValidPort(port)) {
      toaster.error({ title: 'Enter a port between 1 and 65535' });
      return;
    }

    setConnecting(true);

    const socket = new WebSocket(`ws://${ip}:${port}`);

    const cleanup = () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('error', handleError);
      socket.removeEventListener('close', handleError);
      socket.removeEventListener('message', handleMessage);
    };

    const handleMessage = (event: MessageEvent<string>) => {
      setSocket(socket);
      setHostname(event.data);
      setConnecting(false);
      cleanup();
      toaster.success({ title: 'Connected' });
    };

    const handleOpen = () => {
      localStorage.setItem('savedIp', ip);
      localStorage.setItem('savedPort', port);
    };

    const handleError = (event: CloseEvent | Event) => {
      toaster.error({
        title:
          (event as CloseEvent).reason ||
          'Failed to connect. Allow local network access and check the IP and port.',
      });
      setConnecting(false);
      cleanup();
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('error', handleError);
    socket.addEventListener('close', handleError);
    socket.addEventListener('message', handleMessage);
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
            <Field.Label>LAN IPv4 address</Field.Label>
            <Input autoComplete="off" defaultValue={initialIp} name="ip" required />
            <Field.HelperText>Use the local address shown by the desktop host.</Field.HelperText>
          </Field.Root>

          <Field.Root>
            <Field.Label>Port</Field.Label>
            <NumberInput.Root
              defaultValue={initialPort ?? undefined}
              name="port"
              required
              min={1}
              max={65535}
              width="100%"
            >
              <NumberInput.Control />
              <NumberInput.Input />
            </NumberInput.Root>
          </Field.Root>

          <Text color="fg.muted" fontSize="sm">
            System may ask for permission to access devices on your local network
          </Text>
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
