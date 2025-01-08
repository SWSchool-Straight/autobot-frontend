import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet, useNavigate } from 'react-router-dom';
import type { Navigation } from '@toolpad/core';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
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

function SignInButtonComponent() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('login')}
    >
      로그인
    </button>
  );
}

const AUTHENTICATION = {
  signIn: () => <SignInButtonComponent />,
  signOut: () => <button>로그아웃</button>,
};

export default function App() {
  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      authentication={AUTHENTICATION}
    >
      <Outlet />
    </AppProvider>
  );
}
