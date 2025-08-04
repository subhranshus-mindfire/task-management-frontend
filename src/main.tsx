import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './routes/routes';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import { ToastProvider } from './components/ui';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>,
);
