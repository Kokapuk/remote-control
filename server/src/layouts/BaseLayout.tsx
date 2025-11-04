import Titlebar from '@/features/Titlebar/Titlebar';
import { Box, Stack, StackProps } from '@chakra-ui/react';
import { RefAttributes } from 'react';

export type BaseLayoutProps = StackProps & RefAttributes<HTMLDivElement>;

export default function BaseLayout({ children, ...props }: BaseLayoutProps) {
  return (
    <Stack height="100vh" {...props}>
      <Titlebar flexShrink="0" />
      <Box height="100%">{children}</Box>
    </Stack>
  );
}
