import { authApiClient } from "./apiClient";
import { ApiResponse } from '../types/apiResponse';
import { handleApiError } from '../utils/errorHandler';
import { AxiosResponse } from 'axios';
export const refreshTokenApi = async (email: string): Promise<AxiosResponse<ApiResponse>> => {
    try {
        const response = await authApiClient.post('/api/members/refresh', {
            email
        });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
}; 
