import { authApiClient } from "./apiClient";
import { ApiResponse } from "./apiResponse";
import type { RegisterRequest, RegisterResponse } from "../types/register";

// 회원가입 API
export const registerApi = {
    register: async (requestData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
        const response = await authApiClient.post<ApiResponse<RegisterResponse>>('/api/members/register', requestData);
        return response.data;
    },
}; 