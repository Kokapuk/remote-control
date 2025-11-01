import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import RootLayout from './layout/RootLayout';

const Connection = lazy(() => import('./routes/Connection'));
const Controls = lazy(() => import('./routes/Controls'));
const Settings = lazy(() => import('./routes/Settings'));
const Hotbar = lazy(() => import('./routes/Hotbar'));

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
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '/hotbar',
    element: <Hotbar />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
