import { Provider } from '@ui/provider.tsx';
import theme from '@ui/theme.ts';
import { Toaster } from '@ui/toaster.tsx';
import { createRoot } from 'react-dom/client';
import Router from './router.tsx';
import { ChakraProvider } from '@chakra-ui/react';

createRoot(document.getElementById('root')!).render(
  <Provider>
    <ChakraProvider value={theme}>
      <Router />
      <Toaster />
    </ChakraProvider>
  </Provider>
);
