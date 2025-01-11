import axios from "axios";
import { authApiClient } from "../api/apiClient";
import { LoginRequest, LoginResponse } from "../api/loginApi";

// 로그인 API 호출 함수
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await authApiClient.post<LoginResponse>('/api/members/login', data);
        
        // 쿠키는 서버에서 자동으로 설정됨
        // response.headers에서 토큰을 가져올 필요 없음
        
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
            }
            throw new Error(error.response?.data?.message || "로그인 요청에 실패했습니다.");
        }
        throw new Error("로그인 중 알 수 없는 오류가 발생했습니다.");
    }
}; 