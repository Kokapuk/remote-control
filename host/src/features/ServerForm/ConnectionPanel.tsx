import { toaster } from '@/ui/toaster';
import { Box, IconButton, Input, InputGroup, Stack, Text } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';
import { HiMiniSquare2Stack } from 'react-icons/hi2';

const remoteFrontendUrl = 'http://remote-control.local:3000';

export default function ConnectionPanel() {
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(remoteFrontendUrl);
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
        <QRCodeSVG value={remoteFrontendUrl} size={160} />
      </Box>
      <InputGroup
        endElement={
          <IconButton
            aria-label="Copy connection URL"
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
        <Input color="teal.fg" fontFamily="mono" fontSize="sm" readOnly value={remoteFrontendUrl} />
      </InputGroup>
      <Text color="fg.muted" fontSize="xs">
        Make sure your device is on the same network.
      </Text>
    </Stack>
  );
}
