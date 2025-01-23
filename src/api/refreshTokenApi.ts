import { AxiosResponse } from "axios";
import { authApiClient } from "./apiClient";
import { ApiResponse } from './apiResponse';

export const refreshTokenApi = async (email: string): Promise<AxiosResponse<ApiResponse>> => {
    const response = await authApiClient.post('/api/members/refresh', {
        email
    });
    
    return response;
}; 
