import { Button, Card, Field, Input, Stack } from '@chakra-ui/react';
import useSocketStore from '@stores/socket';
import type { FormEvent } from 'react';

export default function MessageForm() {
  const socket = useSocketStore((s) => s.socket);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!socket) {
      return;
    }

    const formdata = Object.fromEntries(new FormData(event.currentTarget).entries());
    socket.send(formdata.message);
    event.currentTarget.reset();
  };

  return (
    <Card.Root as="form" maxW="sm" marginInline="auto" onSubmit={handleSubmit as never}>
      <Card.Header>
        <Card.Title>Message</Card.Title>
      </Card.Header>
      <Card.Body>
        <Stack gap="4" w="full">
          <Field.Root>
            <Field.Label>Message</Field.Label>
            <Input
              name="message"
              type="text"
              required
              maxLength={256}
            />
          </Field.Root>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button type="submit">
          Send
        </Button>
      </Card.Footer>
    </Card.Root>
  );
}
