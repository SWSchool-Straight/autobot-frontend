import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { setAccessToken, clearAccessToken, getAccessToken, getCurrentEmail, handleLogout, clearCurrentEmail } from '../services/loginService';

export interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setIsAuthenticated(true);
      const currentEmail = getCurrentEmail();
      if (currentEmail) {
        setUser({
          email: currentEmail,
          name: currentEmail.split('@')[0]
        });
      } else {
        console.error("사용자 정보를 가져오는 데 실패했습니다.");
      }
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    setAccessToken(token); // 액세스 토큰 설정
  };

  const logout = () => {
    // 로컬 스토리지의 모든 인증 관련 데이터 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    // 상태 초기화
    setIsAuthenticated(false);
    setUser(null);
    setAccessToken(null);
    // 홈 화면으로 이동 후 새로고침
    window.location.href = '/chatbot';
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}