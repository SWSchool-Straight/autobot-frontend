import axios from "axios";
import { getNewToken } from '../services/refreshService';
import { getAccessToken, setAccessToken } from "../services/loginService";
import { useAuth } from '../contexts/AuthContext';


// 인증 관련 API 클라이언트
export const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true,
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

// 인터셉터 설정
authApiClient.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('헤더에 토큰 설정', config);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
authApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 403 에러가 발생한 경우
    if (error.response.status === 401 && !originalRequest._retry) {
      console.error(error.response.message);
      originalRequest._retry = true; // 재시도 플래그 설정

      try {
        const { logout } = useAuth(); // useAuth 훅을 통해 logout 함수 가져오기
        const newToken = await getNewToken(logout); // 새로운 토큰 요청
        if (newToken) {
          console.log('토큰 재발급', newToken);
          setAccessToken(newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // 헤더에 새로운 토큰 추가
          return authApiClient(originalRequest); // 원래 요청 재전송
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
); 