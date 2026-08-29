import useHotbarStore from '@/stores/hotbar';
import SearchInput from '@/ui/search-input';
import VIRTUAL_KEYCODES from '@/utils/virtualKeycodes';
import { Button, IconButton, Stack, Table } from '@chakra-ui/react';
import { debounce } from 'lodash';
import { useRef, useState } from 'react';
import { FaArrowLeft, FaFire } from 'react-icons/fa6';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';

export default function Hotbar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const { hotbarKeycodes, addHotbarKeycode, removeHotbarKeycode } = useHotbarStore(
    useShallow((s) => ({
      hotbarKeycodes: s.hotbarKeycodes,
      addHotbarKeycode: s.addHotbarKeycode,
      removeHotbarKeycode: s.removeHotbarKeycode,
    }))
  );

  const isKeycodeInHotbar = (constant: string) => {
    return hotbarKeycodes.includes(constant);
  };

  const filteredVirtualKeycodes = Object.entries(VIRTUAL_KEYCODES).filter(([constant, key]) => {
    const lowerCaseQuery = query.toLowerCase();

    if (constant.toLowerCase().includes(lowerCaseQuery)) {
      return true;
    }

    if (typeof key.label === 'string' && key.label.toLowerCase().includes(lowerCaseQuery)) {
      return true;
    }

    if (key.description.toLowerCase().includes(lowerCaseQuery)) {
      return true;
    }
  });

  const updateQuery = useRef(
    debounce((query) => {
      setQuery(query);
    }, 300)
  );

  return (
    <Table.Root size="sm" variant="outline" showColumnBorder>
      <Table.Header position="sticky" top="0" zIndex={1}>
        <Table.Row>
          <Table.Cell colSpan={3}>
            <Stack direction="row">
              <IconButton onClick={() => navigate(-1)} size="sm" variant="ghost">
                <FaArrowLeft />
              </IconButton>

              <SearchInput
                onChange={(e) => updateQuery.current(e.currentTarget.value)}
                placeholder="Search"
                variant="subtle"
                size="sm"
              />
            </Stack>
          </Table.Cell>
        </Table.Row>

        <Table.Row>
          <Table.ColumnHeader>Preview</Table.ColumnHeader>
          <Table.ColumnHeader>Description</Table.ColumnHeader>
          <Table.ColumnHeader>Hotbar</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {filteredVirtualKeycodes.map(([constant, key]) => (
          <Table.Row key={constant}>
            <Table.Cell>
              {!!key.label && (
                <Button size="sm" variant="surface">
                  {key.label}
                </Button>
              )}
            </Table.Cell>

            <Table.Cell>{key.description}</Table.Cell>

            <Table.Cell textAlign="end">
              <IconButton
                size="sm"
                variant={isKeycodeInHotbar(constant) ? 'solid' : 'subtle'}
                colorPalette="yellow"
                onClick={() =>
                  isKeycodeInHotbar(constant) ? removeHotbarKeycode(constant) : addHotbarKeycode(constant)
                }
              >
                <FaFire />
              </IconButton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
