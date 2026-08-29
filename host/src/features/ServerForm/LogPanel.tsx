import { Button, Collapsible, Stack, Text } from '@chakra-ui/react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { RefAttributes, useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

export type LogPanelProps = Collapsible.RootProps & RefAttributes<HTMLDivElement>;

export default function LogPanel(props: LogPanelProps) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const logs = await invoke<string[]>('get_logs');
      setLogs(logs.reverse());
    })();
  }, []);

  useEffect(() => {
    const unlisten = listen<string>('log', (event) => {
      setLogs((prev) => [event.payload, ...prev]);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  return (
    <Collapsible.Root
      unmountOnExit
      display="flex"
      flexDirection="column"
      flexShrink="0"
      minHeight="0"
      {...props}
    >
      <Collapsible.Trigger
        asChild
        _open={{ marginBottom: '2' }}
        transitionProperty="background-color,border-color,color,fill,stroke,opacity,box-shadow,translate,transform, margin"
      >
        <Button size="sm" variant="ghost" width="100%" justifyContent="space-between">
          Logs
          <Collapsible.Indicator
            transition="transform 0.2s"
            _open={{ transform: 'rotate(180deg)' }}
          >
            <FaChevronDown />
          </Collapsible.Indicator>
        </Button>
      </Collapsible.Trigger>

      <Collapsible.Content display="flex">
        <Stack
          borderWidth="1px"
          borderRadius="sm"
          gap="1"
          padding="1"
          width="100%"
          direction="column-reverse"
        >
          {logs.map((log, index) => (
            <Text key={index} fontSize="sm" _even={{ backgroundColor: 'bg.muted' }}>
              {log}
            </Text>
          ))}
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
