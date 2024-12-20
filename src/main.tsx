import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages';
import ChatbotPage from './pages/ChatbotPage';
import HistoryPage from './pages/HistoryPage';
import Layout from './layouts/dashboard';

const router = createBrowserRouter([
    {
      Component: App, // root layout route
      children: [
        {
          path: '/',
          Component: Layout,
          children: [
            {
              path: '',
              Component: DashboardPage,
            },
            {
              path: 'chatbot',
              Component: ChatbotPage,
            },
            {
              path: 'history',
              Component: HistoryPage,
            }
          ],
        },
      ],
    },
  ]);

// App 컴포넌트 렌더링 (라우터 설정 포함)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
