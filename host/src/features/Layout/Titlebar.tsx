import { Box, BoxProps } from '@chakra-ui/react';
import { RefAttributes } from 'react';
import WindowsNavigation from './WindowsNavigation';

export type TitlebarProps = BoxProps & RefAttributes<HTMLDivElement>;

export default function Titlebar(props: TitlebarProps) {
  return (
    <Box data-tauri-drag-region height="8" {...props}>
      <WindowsNavigation />
    </Box>
  );
}
