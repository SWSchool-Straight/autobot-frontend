import * as React from 'react';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import { AppProvider } from '@toolpad/core';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import type { Navigation, Session } from '@toolpad/core';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HistoryIcon from '@mui/icons-material/History';
import ChatbotPage from './pages/ChatbotPage';
import HistoryPage from './pages/HistoryPage';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
});

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'chatbot',
    title: 'New Chat',
    icon: <SmsRoundedIcon />,
  },
  {
    segment: 'history',
    title: '대화 기록',
    icon: <HistoryIcon />,
    children: [
      {
        segment: 'topic1',
        title: '2년 미만 중고차 보여줘',
      },
      {
        segment: 'topic2',
        title: '3000만원 이하 중고차 찾아줘',
      },
    ],
  },
];

const BRANDING = {
  logo: <img src="src/assets/logo.png" alt="hyundai logo" />,
  title: 'Chatbot',
};

function PageContent({ pathname }: { pathname: string }) {
  switch (pathname) {
    case '/chatbot':
      return <ChatbotPage />;
    case '/history':
      return <HistoryPage />;
    default:
      return <ChatbotPage />;
  }
}

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const [session, setSession] = React.useState<Session | null>();

  const router = {
    pathname: location.pathname,
    push: navigate,
    replace: (path: string) => navigate(path, { replace: true }),
    searchParams: new URLSearchParams(location.search),
    navigate: (options: any) => navigate(options)
  };

  const AUTHENTICATION = {
    signIn: () => {
      navigate('/login');
    },
    signOut: () => {
      setSession(null);
      logout();
      navigate('/chatbot');
    },
    isAuthenticated,
    labels: {
      login: '로그인',
      logout: '로그아웃',
    },
  };

  React.useEffect(() => {
    if (user) {
      setSession({
        user: {
          email: user.email,
          name: user.name,
        },
      });
    }
  }, [user]);

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={session}
      authentication={AUTHENTICATION}
      router={router}
      theme={theme}
    >
      <Outlet />
    </AppProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
