import axios from "axios";
import { registerApi } from "../api/registerApi";
import { validateRegisterData } from "../utils/validators";
import type { RegisterRequest, RegisterResponse } from "../types/register";
import type { ApiResponse } from "../api/apiResponse";

// 회원가입 API 호출 함수
export const register = async (requestData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
    try {
        validateRegisterData(requestData);
        return await registerApi.register(requestData);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            switch (error.response?.status) {
                case 409:
                    throw new Error("이미 사용 중인 이메일입니다.");
                case 403:
                    throw new Error("필수 정보가 누락되었습니다.");
                case 500:
                    throw new Error("서버 오류가 발생했습니다.");
                default:
                    throw new Error(error.response?.data?.message || "회원가입 요청에 실패했습니다.");
            }
        }
        throw error;
    }
};