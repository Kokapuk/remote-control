import { Box } from '@chakra-ui/react';
import { Suspense } from 'react';
import { Outlet } from 'react-router';

export default function RootLayout() {
  return (
    <Box as="main" paddingTop="10" paddingInline="5">
      <Suspense>
        <Outlet />
      </Suspense>
    </Box>
  );
}
