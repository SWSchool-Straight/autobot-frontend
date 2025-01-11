import axios from "axios";
import { authApiClient } from "./api";

// 회원가입 API 호출 함수
export const register = async (data: any) => {
    try {
        const response = await authApiClient.post('/api/members/register', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("회원가입 에러:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw new Error(error.response?.data?.message || "회원가입 요청에 실패했습니다.");
        }
        throw new Error("회원가입 요청에 실패했습니다.");
    }
}; 