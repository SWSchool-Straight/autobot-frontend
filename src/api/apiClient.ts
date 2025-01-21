import axios from "axios";
import { refreshToken } from '../services/refreshService';

// 인증 관련 API 클라이언트
export const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,  // 쿠키를 자동으로 포함
  timeout: 5000,
}); 

// 채팅 관련 API 클라이언트
export const chatApiClient = axios.create({
  baseURL: import.meta.env.VITE_CHAT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 5000,
}); 

// 헤더에 액세스 토큰 세팅
export const setAccessToken = (token: string) => {
  // 현재 세션의 요청에만 사용될 Authorization 헤더 설정
  authApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}; 

// 인터셉터 설정
authApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshToken();
                if (newToken) {
                    setAccessToken(newToken);
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return authApiClient(originalRequest);
                }
            } catch (refreshError) {
                // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
); 