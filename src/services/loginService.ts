import axios from "axios";
import { authApiClient } from "./api";

// 로그인 API 호출 함수
export const login = async (data: any) => {
    try {
        const response = await authApiClient.post('/api/members/login', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("로그인 에러:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw new Error(error.response?.data?.message || "로그인 요청에 실패했습니다.");
        }
        throw new Error("로그인 중 알 수 없는 오류가 발생했습니다.");
    }
}; 