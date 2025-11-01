import useHotbarStore from '@/stores/hotbar';
import useSocketStore from '@/stores/socket';
import VIRTUAL_KEYCODES from '@/utils/virtualKeycodes';
import { ActionBar, Button, CloseButton, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import { FaChevronUp } from 'react-icons/fa6';

export default function Hotbar() {
  const [isOpen, setOpen] = useState(false);
  const hotbarKeycodes = useHotbarStore((s) => s.hotbarKeycodes);
  const socket = useSocketStore((s) => s.socket);

  if (!hotbarKeycodes) {
    return null;
  }

  const handleKeycodePress = (constant: string) => {
    navigator.vibrate(20);
    socket?.send(JSON.stringify({ type: 'keyboardPress', keycode: VIRTUAL_KEYCODES[constant].value }));
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          position="fixed"
          left="50%"
          bottom="0"
          transform="translateX(-50%)"
        >
          <FaChevronUp />
        </Button>
      )}

      <ActionBar.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)} closeOnInteractOutside={false}>
        <Portal>
          <ActionBar.Positioner left="20px" right="20px">
            <ActionBar.Content flexWrap="wrap" justifyContent="center" maxHeight="40" overflow="auto">
              {hotbarKeycodes.map((constant) => (
                <Button key={constant} onClick={() => handleKeycodePress(constant)} variant="surface" size="sm">
                  {VIRTUAL_KEYCODES[constant].label}
                </Button>
              ))}

              <ActionBar.CloseTrigger asChild>
                <CloseButton size="sm" variant="subtle" colorPalette="red" />
              </ActionBar.CloseTrigger>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
}
