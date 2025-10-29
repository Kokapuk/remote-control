import { ActionBar, CloseButton, Portal, Text } from '@chakra-ui/react';
import useSocketStore from '@stores/socket';
import { Tooltip } from '@ui/tooltip';
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
            <Text>{hostname}</Text>
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
