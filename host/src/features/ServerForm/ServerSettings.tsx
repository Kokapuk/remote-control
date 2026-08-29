import { Switch } from '@/ui/switch';
import { Button, Field, NumberInput, Stack, Text } from '@chakra-ui/react';
import { HiPlay, HiStop } from 'react-icons/hi2';

export type ServerSettingsProps = {
  allowMultipleConnections: boolean;
  isServerRunning: boolean;
  onAllowMultipleConnectionsChange: (checked: boolean) => void;
  onPortChange: (port: number) => void;
  port: number;
};

export default function ServerSettings({
  allowMultipleConnections,
  isServerRunning,
  onAllowMultipleConnectionsChange,
  onPortChange,
  port,
}: ServerSettingsProps) {
  return (
    <Stack flex="1" gap="4">
      <Stack direction="row" alignItems="center" gap="3">
        <Text fontSize="lg" fontWeight="semibold">
          Server
        </Text>
        <Stack
          direction="row"
          alignItems="center"
          ms="auto"
          color={isServerRunning ? 'green.fg' : 'fg.muted'}
          gap="1"
        >
          <BoxStatus />
          <Text fontSize="sm">{isServerRunning ? 'Running' : 'Stopped'}</Text>
        </Stack>
      </Stack>

      <Field.Root>
        <Field.Label>Port</Field.Label>
        <NumberInput.Root
          required
          readOnly={isServerRunning}
          value={port.toString()}
          onValueChange={(event) => onPortChange(event.valueAsNumber)}
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
          onCheckedChange={(event) => onAllowMultipleConnectionsChange(event.checked)}
          name="allowMultipleConnections"
          disabled={isServerRunning}
          size="lg"
        />
      </Field.Root>

      <Button
        type="submit"
        alignSelf={{ base: 'center', md: 'flex-start' }}
        colorPalette={isServerRunning ? 'red' : undefined}
        marginTop="auto"
      >
        {isServerRunning ? <HiStop /> : <HiPlay />}
        {isServerRunning ? 'Stop server' : 'Start server'}
      </Button>
    </Stack>
  );
}

function BoxStatus() {
  return <Stack background="currentColor" borderRadius="full" height="2" width="2" />;
}
