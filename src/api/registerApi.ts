import { authApiClient } from "./apiClient";
import { ApiResponse } from "./apiResponse";

// 회원가입 API
export interface RegisterRequest {
    email: string;
    password: string;
    birthDate: string;
    gender: "M" | "F";
    name: string;
}

export interface RegisterResponse {
    memberName: string;
    memberId: number;
}

export const registerApi = {
    register: async (requestData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
        const response = await authApiClient.post<ApiResponse<RegisterResponse>>('/api/members/register', requestData);
        return response.data;
    },
}; 