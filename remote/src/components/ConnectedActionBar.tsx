import useSocketStore from '@/stores/socket';
import { ActionBar, CloseButton, IconButton, Portal, Text } from '@chakra-ui/react';
import { FaFire, FaSliders } from 'react-icons/fa6';
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
        <ActionBar.Positioner
          top="20px"
          bottom="unset"
          justifyContent="flex-end"
          paddingRight="20px"
        >
          <ActionBar.Content>
            <Text fontSize="xs">{hostname}</Text>

            <ActionBar.Separator />

            <Link to="/settings">
              <IconButton variant="subtle" size="sm">
                <FaSliders />
              </IconButton>
            </Link>
            <Link to="/hotbar">
              <IconButton variant="subtle" size="sm">
                <FaFire />
              </IconButton>
            </Link>

            <ActionBar.Separator />

            <ActionBar.CloseTrigger asChild>
              <CloseButton size="sm" variant="subtle" colorPalette="red" />
            </ActionBar.CloseTrigger>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
