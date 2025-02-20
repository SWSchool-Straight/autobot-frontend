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
  timeout: 30000,
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

// 채팅 API 인터셉터 설정
chatApiClient.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      // 토큰이 있는 경우만 Authorization 헤더 추가
      config.headers['Authorization'] = `Bearer ${token}`;
    
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 채팅 API 응답 인터셉터 설정
chatApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // 서버가 응답을 반환한 경우
      const { status } = error.response;
      if (status === 401) {
        // 토큰이 만료된 경우
        // 여기서 토큰 갱신 로직을 추가할 수 있습니다
        if (getAccessToken() && !error.config._retry) {
          const { logout } = useAuth();
          const newToken = await getNewToken(logout);
          if (newToken) {
            setAccessToken(newToken);
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return chatApiClient(error.config);
          }
        }
        return Promise.reject({
          ...error,
          message: '인증이 만료되었습니다. 다시 로그인해주세요.'
        });
      }
      if (status === 403) {
        return Promise.reject({
          ...error,
          message: '접근 권한이 없습니다.'
        });
      }
      if (status === 500) {
        return Promise.reject({
          ...error,
          message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        });
      }
    } else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      return Promise.reject({
        ...error,
        message: '서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.'
      });
    }
    // 그 외의 에러
    return Promise.reject({
      ...error,
      message: '알 수 없는 오류가 발생했습니다.'
    });
  }
); 