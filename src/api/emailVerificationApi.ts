import { authApiClient } from "./apiClient";
import { ApiResponse } from "./apiResponse";

interface EmailVerificationResponse {
    isVerified: boolean;
}

export const emailVerificationApi = {
    sendVerificationEmail: async (email: string): Promise<ApiResponse<void>> => {
        const response = await authApiClient.post<ApiResponse>('/api/auth/email/verify', { email });
        return response.data;
    },

    verifyEmailCode: async (email: string, code: string): Promise<ApiResponse<EmailVerificationResponse>> => {
        const response = await authApiClient.post<ApiResponse<EmailVerificationResponse>>('/api/auth/email/verify-code', {
            email,
            code
        });
        return response.data;
    }
}; 