import { ChakraProvider } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';
import App from './App';
import BaseLayout from './layouts/BaseLayout';
import { Provider } from './ui/provider';
import theme from './ui/theme';
import { Toaster } from './ui/toaster';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider>
    <ChakraProvider value={theme}>
      <BaseLayout>
        <App />
      </BaseLayout>
      <Toaster />
    </ChakraProvider>
  </Provider>
);
