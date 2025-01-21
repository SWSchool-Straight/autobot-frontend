import { AxiosResponse } from "axios";
import { authApiClient } from "../api/apiClient";
import { ApiResponse } from './apiResponse';

// 로그인 요청 데이터 타입
export interface LoginRequest {
    email: string;
    password: string;
}

// 로그인 응답 데이터 타입
export interface LoginResponse {
    email: string;
}

// 로그인 API 호출 함수
export const login = (data: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
    return authApiClient.post('/api/members/login', data);
};

// 헤더에 액세스 토큰 세팅
export const setAccessToken = (token: string) => {
    authApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
