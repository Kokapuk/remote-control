import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import RootLayout from './layout/RootLayout';

const Connection = lazy(() => import('./routes/Connection'));
const Controls = lazy(() => import('./routes/Controls'));

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Connection />,
      },
      {
        path: '/controls',
        element: <Controls />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
