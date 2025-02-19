import { AxiosResponse } from "axios";
import { authApiClient } from "../api/apiClient";
import { ApiResponse } from '../types/apiResponse';
import { LoginRequest, LoginResponse } from '../types/login';
import { handleApiError } from '../utils/errorHandler';

// 로그인 API 호출 함수
export const loginApi = (data: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> => {
    return authApiClient.post('/api/members/login', data);
};

// 로그아웃 API 호출 함수
export const logoutApi = async (email: string): Promise<ApiResponse> => {
    try {
        const response = await authApiClient.post('/api/members/logout', { email });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};