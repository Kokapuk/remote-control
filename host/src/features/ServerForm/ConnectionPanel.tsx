import { toaster } from '@/ui/toaster';
import { Box, IconButton, Input, InputGroup, Stack, Text } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';
import { HiMiniSquare2Stack } from 'react-icons/hi2';

export type ConnectionPanelProps = {
  ip: string | null;
  port: number;
};

export default function ConnectionPanel({ ip, port }: ConnectionPanelProps) {
  const connectionUrl = useMemo(() => {
    if (!ip || !Number.isInteger(port) || port < 1 || port > 65535) {
      return null;
    }

    const url = new URL(import.meta.env.VITE_REMOTE_FRONTEND_URL);
    url.searchParams.set('ip', ip);
    url.searchParams.set('port', port.toString());

    return url.toString();
  }, [ip, port]);

  const copyUrl = async () => {
    if (!connectionUrl) return;

    try {
      await navigator.clipboard.writeText(connectionUrl);
      toaster.create({ title: 'Connection URL copied', type: 'success' });
    } catch {
      toaster.create({ title: 'Could not copy connection URL', type: 'error' });
    }
  };

  return (
    <Stack alignItems="center" flex="1" gap="3" textAlign="center">
      <Text fontSize="lg" fontWeight="semibold">
        Connect
      </Text>
      <Text color="fg.muted" fontSize="sm">
        Scan to connect
      </Text>
      <Box background="white" borderRadius="md" padding="2">
        {connectionUrl ? (
          <QRCodeSVG value={connectionUrl} size={160} />
        ) : (
          <Box color="gray.700" display="grid" height="160px" placeItems="center" width="160px">
            Local IP unavailable
          </Box>
        )}
      </Box>
      <InputGroup
        endElement={
          <IconButton
            aria-label="Copy connection URL"
            disabled={!connectionUrl}
            onClick={copyUrl}
            size="sm"
            type="button"
            variant="ghost"
          >
            <HiMiniSquare2Stack />
          </IconButton>
        }
        width="100%"
      >
        <Input
          color="teal.fg"
          fontFamily="mono"
          fontSize="sm"
          readOnly
          value={connectionUrl ?? 'Local network address unavailable'}
        />
      </InputGroup>
      <Text color="fg.muted" fontSize="xs">
        Make sure your device is on the same network
      </Text>
    </Stack>
  );
}
