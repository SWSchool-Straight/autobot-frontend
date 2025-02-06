import * as React from 'react';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import { AppProvider } from '@toolpad/core';
import { useNavigate, useLocation, Outlet, Routes, Route } from 'react-router-dom';
import type { Session } from '@toolpad/core';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HistoryIcon from '@mui/icons-material/History';
import ChatbotPage from './pages/ChatbotPage';
import HistoryPage from './pages/HistoryPage';
import { createTheme } from '@mui/material/styles';
import { useState } from 'react';
import { ChatServiceProvider } from './contexts/ChatServiceContext';
import { newChatService } from './services/newChatService';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import NewChatPage from './pages/NewChatPage';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
});

interface NavigationItem {
  kind?: 'header';
  segment?: string;
  title: string;
  icon?: React.ReactNode;
  children?: Array<{
    segment: string;
    title: string;
  }>;
}

const BRANDING = {
  logo: <img src="src/assets/logo.png" alt="hyundai logo" />,
  title: 'Chatbot',
};

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const [session, setSession] = React.useState<Session | null>();
  const [navigation, setNavigation] = useState<NavigationItem[]>([
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
      children: [],
    },
  ]);

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

  const updateNavigation = (conversationId: number, title: string) => {
    setNavigation(prev => {
      const newNav = [...prev];
      const historyItem = newNav.find(item => item.segment === 'history');
      
      if (historyItem) {
        if (!historyItem.children) {
          historyItem.children = [];
        }
        
        // 이미 존재하는 대화인지 확인
        const existingChat = historyItem.children.find(
          child => child.segment === `${conversationId}`
        );
        
        if (!existingChat) {
          historyItem.children.unshift({
            segment: `${conversationId}`,
            title: title
          });
        }
      }
      return newNav;
    });
  };

  const chatServiceContextValue = {
    createTab: async (content: string) => {
      const result = await newChatService.createTab(content);
      updateNavigation(result.conversationId, result.title);
      return result;
    },
    addNewConversation: (title: string, id: number) => {
      updateNavigation(id, title);
    }
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

  React.useEffect(() => {
    const loadConversationHistory = async () => {
      try {
        const conversations = await newChatService.getConversationList();
        setNavigation(prev => {
          const newNav = [...prev];
          const historyItem = newNav.find(item => item.segment === 'history');
          
          if (historyItem) {
            historyItem.children = conversations.map(conv => ({
              segment: `${conv.conversationId}`,
              title: conv.title
            }));
          }
          return newNav;
        });
      } catch (error) {
        console.error('대화 기록 로딩 실패:', error);
      }
    };

    if (isAuthenticated) {
      loadConversationHistory();
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return (
    <AppProvider
      navigation={navigation}
      branding={BRANDING}
      session={session}
      authentication={AUTHENTICATION}
      router={router}
      theme={theme}
    >
      <ChatServiceProvider value={chatServiceContextValue}>
        <DashboardLayout>
          <Routes>
            <Route element={<Outlet />}>
              <Route index element={<NewChatPage />} />
              <Route path="chatbot" element={<NewChatPage />} />
              <Route path="history">
                <Route index element={<HistoryPage />} />
                <Route path=":conversationId" element={<ChatbotPage />} />
              </Route>
            </Route>
          </Routes>
        </DashboardLayout>
      </ChatServiceProvider>
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
