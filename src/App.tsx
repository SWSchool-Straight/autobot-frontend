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
import { useState, useEffect } from 'react';
import { ChatServiceProvider } from './contexts/ChatServiceContext';
import { newChatService } from './services/newChatService';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import NewChatPage from './pages/NewChatPage';
import autobot_logo from './assets/autobot_logo.svg';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true },
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
  logo: <img src={autobot_logo} alt="Autobot logo" />,
  title: '',
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

  const updateNavigation = (conversationId: string, title: string) => {
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

  const MAX_TITLE_LENGTH = 22;

  // 제목 자르기 함수 추가
  const truncateTitle = (title: string) => {
    return title.length > MAX_TITLE_LENGTH 
      ? `${title.slice(0, MAX_TITLE_LENGTH)}...` 
      : title;
  };

  const chatServiceContextValue = {
    createTab: async (content: string) => {
      const result = await newChatService.createTab(content);
      updateNavigation(result.conversationId, result.title);
      return result;
    },
    addNewConversation: (title: string, id: string) => {
      updateNavigation(id, title);
    }
  };

  useEffect(() => {
    if (user) {
      setSession({
        user: {
          email: user.email,
          name: user.name,
        },
      });
    }
  }, [user]);

  useEffect(() => {
    const loadConversationHistory = async () => {
      try {
        const conversations = await newChatService.getConversationList();
        setNavigation(prev => {
          const newNav = [...prev];
          const historyItem = newNav.find(item => item.segment === 'history');
          
          if (historyItem) {
            historyItem.children = conversations.map(conv => ({
              segment: `${conv.conversationId}`,
              title: truncateTitle(conv.title)
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

  // 페이지 이동 전 경고 처리
  useEffect(() => {
    const handleBeforeNavigate = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const closestLink = target.closest('a');
      
      if (closestLink) {
        const href = closestLink.getAttribute('href');
        // 현재 채팅방에서 홈화면(/) 또는 새로운 채팅(/chatbot)으로 이동하려는 경우
        if (
          !isAuthenticated && 
          (href === '/' || href === '/chatbot') && 
          location.pathname.startsWith('/history/') &&
          sessionStorage.getItem('chatMessages')
        ) {
          e.preventDefault();
          e.stopPropagation();
          
          const confirmLeave = window.confirm('현재 대화 내용이 저장되지 않습니다. 새로운 대화를 시작하시겠습니까?');
          if (confirmLeave) {
            sessionStorage.removeItem('chatMessages');
            sessionStorage.removeItem('currentConversationId');
            // 네비게이션에서 현재 대화 탭 제거
            setNavigation(prev => {
              const newNav = [...prev];
              const historyItem = newNav.find(item => item.segment === 'history');
              if (historyItem && historyItem.children) {
                historyItem.children = [];
              }
              return newNav;
            });
            navigate('/chatbot');
          }
        }
      }
    };

    const cleanup = () => {
      document.removeEventListener('click', handleBeforeNavigate, true);
    };

    document.addEventListener('click', handleBeforeNavigate, true);
    return cleanup;
  }, [isAuthenticated, location.pathname, navigate]);

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
