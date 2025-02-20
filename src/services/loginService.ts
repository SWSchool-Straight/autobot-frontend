import axios from "axios";
import { LoginRequest } from "../types/login";
import { loginApi, logoutApi } from "../api/loginApi";
import { authApiClient } from "../api/apiClient";
import { User } from "../contexts/AuthContext";
import { ApiError } from "../utils/errorHandler";

// 현재 액세스 토큰을 저장할 변수
let accessToken: string | null = null;

// 현재 이메일을 저장할 변수 (상태 관리)
let currentEmail: string | null = null;

export const getAccessToken = (): string | null => {
    return accessToken || localStorage.getItem('accessToken'); // 메모리에서 우선적으로 가져오기
};

export const setAccessToken = (token: string | null) => {
    accessToken = token; // 메모리에 저장
    if (token) {
        localStorage.setItem('accessToken', token); // 로컬 스토리지에도 저장
        authApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete authApiClient.defaults.headers.common['Authorization'];
    }
};

export const clearAccessToken = () => {
    accessToken = null; // 메모리에서 제거
    delete authApiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('accessToken'); // 로컬 스토리지에서도 제거
};

export const setCurrentEmail = (email: string) => {
    currentEmail = email; // 메모리에 저장
    localStorage.setItem('userEmail', email); // 로컬 스토리지에도 저장
};

export const getCurrentEmail = (): string | null => {
    return currentEmail || localStorage.getItem('userEmail'); // 메모리에서 우선적으로 가져오기
};

export const clearCurrentEmail = () => {
    currentEmail = null;
    localStorage.removeItem('userEmail'); // 이메일이 null일 경우 로컬 스토리지에서 제거
}

// 로그인 처리 함수
export const handleLogin = async (
  loginData: LoginRequest,
  login: (userData: User, token: string) => void
): Promise<void> => {
  try {
    const response = await loginApi(loginData);
    
    if (!response?.data?.info) {
      throw new Error('로그인 응답 데이터가 올바르지 않습니다.');
    }

    const authHeader = response.headers['authorization'];
    if (!authHeader) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const token = authHeader.replace('Bearer ', '');
    const userData = {
      email: loginData.email,
      name: loginData.email.split('@')[0]
    };

    setAccessToken(token);
    setCurrentEmail(loginData.email);
    login(userData, token);
  } catch (error) {
    console.error('로그인 처리 중 에러 발생:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('로그인 중 알 수 없는 오류가 발생했습니다.');
  }
};

// 로그인 제출 처리 함수
export const handleLoginSubmit = async(
    email: string,
    password: string,
    login: (userData: User, token: string) => void, // login 함수를 매개변수로 추가
    onNavigate: (path: string) => void
): Promise<string | null> => {
    try {
        const loginData: LoginRequest = { email, password };
        await handleLogin(loginData, login); // login을 매개변수로 전달

        onNavigate("/chatbot");  // 채팅 화면으로 이동
        return null;

    } catch (err: any) {
        console.error('로그인 제출 중 에러 발생:', err); // 에러 로그 추가
        return err.message || "로그인 중 알 수 없는 오류가 발생했습니다."; // 기본 메시지 추가
    }
};

// 로그인 에러 처리 함수
const handleLoginError = (error: any) => {
    if (axios.isAxiosError(error)) {
        // Axios 에러인 경우
        const response = error.response; // 응답 객체
        if (response) {
            const status = response.status; // 상태 코드
            const message = response.data?.message; // 메시지

            if (status === 400) {
                if (message === "Email not found") {
                    throw new Error("존재하지 않는 이메일입니다.");
                } else if (message === "Incorrect password") {
                    throw new Error("비밀번호가 올바르지 않습니다.");
                }
            } else if (status === 401) {
                throw new Error("인증이 실패했습니다. 다시 시도해주세요.");
            }
            throw new Error(message || "로그인 요청에 실패했습니다.");
        } else {
            // 응답이 없는 경우
            throw new Error("서버 응답이 없습니다. 네트워크를 확인하세요.");
        }
    } else {
        // Axios가 아닌 다른 에러인 경우
        throw new Error("로그인 중 알 수 없는 오류가 발생했습니다.");
    }
};

// 로그아웃 처리 함수
export const handleLogout = async (email: string, logout: () => void): Promise<void> => {
    try {
        const response = await logoutApi(email); // 로그아웃 API 호출
        if (response.status === 200) {
            clearAccessToken();
            clearCurrentEmail();
            logout();
        } else {
            throw new ApiError(response.message || "로그아웃 요청에 실패했습니다.");
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError("로그아웃 중 오류가 발생했습니다.");
    }
};