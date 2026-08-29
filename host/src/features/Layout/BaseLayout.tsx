import Footer from '@/features/Layout/Footer';
import Titlebar from '@/features/Layout/Titlebar';
import { Box, Stack, StackProps } from '@chakra-ui/react';
import { RefAttributes } from 'react';

export type BaseLayoutProps = StackProps & RefAttributes<HTMLDivElement>;

export default function BaseLayout({ children, ...props }: BaseLayoutProps) {
  return (
    <Stack height="100vh" {...props}>
      <Titlebar flexShrink="0" />
      <Box flex="1" minHeight="0">
        {children}
      </Box>
      <Footer paddingInline="2" paddingBottom="2" />
    </Stack>
  );
}
