import * as React from 'react';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { AppProvider } from '@toolpad/core';
import { Outlet, useNavigate } from 'react-router-dom';
import type { Navigation, Session } from '@toolpad/core';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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

const AppContent = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  
  const [session, setSession] = React.useState<Session | null>();

  const AUTHENTICATION = {
    signIn: () => {
      navigate('/login');
    },
    signOut: () => {
      setSession(null);
      logout();
      navigate('/');
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
