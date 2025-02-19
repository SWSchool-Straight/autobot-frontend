import { authApiClient } from "./apiClient";
import { ApiResponse } from '../types/apiResponse';
import { handleApiError } from '../utils/errorHandler';

export const refreshTokenApi = async (email: string): Promise<ApiResponse> => {
    try {
        const response = await authApiClient.post('/api/members/refresh', {
            email
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}; 
