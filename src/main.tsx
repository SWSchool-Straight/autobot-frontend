import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import App from './App';
import ChatbotPage from './pages/ChatbotPage';
import NewChatPage from './pages/NewChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <NewChatPage />
      },
      {
        path: 'chatbot',
        element: <NewChatPage />,
      },
      {
        path: 'history',
        children: [
          {
            index: true,
            element: <ChatbotPage />
          },
          {
            path: ':conversationId',
            element: <ChatbotPage />
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <RegisterPage />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
