import axios from "axios";
import { authApiClient } from "../api/apiClient";
import { RegisterRequest, RegisterResponse } from "../api/registerApi";

// 회원가입 데이터 유효성 검사
const formatBirthDate = (birthDate: string): string => {
    // YYMMDD 형식 체크
    if (/^\d{6}$/.test(birthDate)) {
        const year = parseInt(birthDate.substring(0, 2));
        const month = birthDate.substring(2, 4);
        const day = birthDate.substring(4, 6);
        
        // 현재 년도의 뒤 두 자리
        const currentYear = new Date().getFullYear() % 100;
        // 년도가 현재 년도보다 크면 1900년대, 작으면 2000년대
        const fullYear = year > currentYear ? 1900 + year : 2000 + year;
        
        return `${fullYear}-${month}-${day}`;
    }
    return birthDate; // 이미 YYYY-MM-DD 형식이면 그대로 반환
}

const validateRegisterData = (data: RegisterRequest) => {
    if (!data.email || !data.email.includes('@') || data.email.length > 100) {
        throw new Error("이메일 형식이 올바르지 않습니다.");
    }
    if (!data.password || data.password.length < 4 || data.password.length > 100) {
        throw new Error("비밀번호는 4자 이상 100자 이하여야 합니다.");
    }
    if (!data.name || data.name.length > 50) {
        throw new Error("이름은 50자 이하여야 합니다.");
    }
    // 생년월일 형식 변환 및 검증
    data.birthDate = formatBirthDate(data.birthDate);
    if (!data.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
        throw new Error("생년월일 형식이 올바르지 않습니다. (YYMMDD 또는 YYYY-MM-DD)");
    }
    if (!data.gender || !["M", "F"].includes(data.gender)) {
        throw new Error("성별은 'M' 또는 'F'여야 합니다.");
    }
};

// 회원가입 API 호출 함수
export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
        // 데이터 유효성 검사
        validateRegisterData(data);

        const response = await authApiClient.post<RegisterResponse>('/api/members/register', data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // HTTP 상태 코드에 따른 에러 처리
            switch (error.response?.status) {
                case 409:
                    throw new Error("이미 사용 중인 이메일입니다.");
                case 403:
                    throw new Error("필수 정보가 누락되었습니다.");
                case 500:
                    throw new Error("서버 오류가 발생했습니다.");
                default:
                    console.error("회원가입 에러:", {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.message
                    });
                    throw new Error(error.response?.data?.message || "회원가입 요청에 실패했습니다.");
            }
        }
        throw new Error("회원가입 중 알 수 없는 오류가 발생했습니다.");
    }
};