import { Theme } from '@chakra-ui/react';
import { Provider } from '@ui/provider.tsx';
import { Toaster } from '@ui/toaster.tsx';
import { createRoot } from 'react-dom/client';
import Router from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider>
    <Theme appearance="dark" colorPalette="teal">
      <Router />
      <Toaster />
    </Theme>
  </Provider>
);
