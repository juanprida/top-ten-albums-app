import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Root from './pages/Root';
import Home from './pages/Home';
import AppEditor from './pages/AppEditor';
import PublicProfile from './pages/PublicProfile';
import AllUsers from './pages/AllUsers';
import { ToastProvider } from '@/components/Toast';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'app', element: <AppEditor /> },
      { path: 'user/:username', element: <PublicProfile /> },
      { path: 'users', element: <AllUsers /> },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  </React.StrictMode>
);
