import { Box, type BoxProps } from '@chakra-ui/react';
import { Suspense, type RefAttributes } from 'react';
import { Outlet } from 'react-router';

export type RootLayoutProps = BoxProps & RefAttributes<HTMLDivElement>;

export default function RootLayout(props: RootLayoutProps) {
  return (
    <Box as="main" paddingTop="10" paddingInline="5" {...props}>
      <Suspense>
        <Outlet />
      </Suspense>
    </Box>
  );
}
