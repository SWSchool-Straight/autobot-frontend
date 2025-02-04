import * as React from 'react';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { AppProvider } from '@toolpad/core';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import type { Navigation, Session } from '@toolpad/core';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
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
    title: 'Chatbot',
    icon: <SmsRoundedIcon />,
  },
  {
    segment: 'history',
    title: '최근 본 차량',
    icon: <DirectionsCarFilledIcon />,
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
