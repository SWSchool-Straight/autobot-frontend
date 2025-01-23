import { AxiosResponse } from "axios";
import { authApiClient } from "../api/apiClient";
import { ApiResponse } from '../api/apiResponse';

// 로그인 API 호출 함수
export const authTestApi = (): Promise<AxiosResponse<ApiResponse>> => {
    return authApiClient.get('/api/test');
}