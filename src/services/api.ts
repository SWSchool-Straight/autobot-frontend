import axios from "axios";

// 인증 관련 API 클라이언트
export const authApiClient = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
  withCredentials: true,
}); 

// 채팅 관련 API 클라이언트
export const chatApiClient = axios.create({
  baseURL: import.meta.env.VITE_CHAT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
  withCredentials: true,
}); 