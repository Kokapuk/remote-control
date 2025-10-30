import { ActionBar, CloseButton, IconButton, Portal, Text } from '@chakra-ui/react';
import useSocketStore from '@stores/socket';
import { Tooltip } from '@ui/tooltip';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';
import { Link } from 'react-router';
import { useShallow } from 'zustand/shallow';

export default function ConnectedActionBar() {
  const { socket, hostname } = useSocketStore(
    useShallow((s) => ({ socket: s.socket, setSocket: s.setSocket, hostname: s.hostname }))
  );

  const closeConnection = () => {
    if (!socket) {
      return;
    }

    socket.close();
  };

  return (
    <ActionBar.Root open onOpenChange={(e) => !e.open && closeConnection()} closeOnInteractOutside={false}>
      <Portal>
        <ActionBar.Positioner>
          <ActionBar.Content>
            <Text fontSize="xs">{hostname}</Text>

            <ActionBar.Separator />

            <Link to="/settings">
              <Tooltip content="Settings">
                <IconButton variant="subtle" size="sm">
                  <HiAdjustmentsHorizontal />
                </IconButton>
              </Tooltip>
            </Link>

            <ActionBar.Separator />

            <Tooltip content="Disconnect">
              <ActionBar.CloseTrigger asChild>
                <CloseButton size="sm" />
              </ActionBar.CloseTrigger>
            </Tooltip>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
