import { refreshTokenApi } from "../api/refreshTokenApi";

// 현재 이메일을 저장할 변수 (상태 관리)
let currentEmail: string | null = null;

export const setCurrentEmail = (email: string | null) => {
    currentEmail = email;
    console.log('현재 저장된 이메일:', currentEmail); // 개발용 로그
};

export const getCurrentEmail = (): string | null => {
    console.log('현재 저장된 이메일 조회:', currentEmail); // 개발용 로그
    return currentEmail;
};

// 비즈니스 로직
export const refreshToken = async (): Promise<string> => {
    if (!currentEmail) {
        throw new Error("이메일이 설정되지 않았습니다.");
    }

    try {
        const response = await refreshTokenApi(currentEmail);
        const authHeader = response?.headers['authorization'];
        
        if (!authHeader) {
            throw new Error('Authorization 헤더가 존재하지 않습니다.');
        }

        // Bearer 접두사 제거 후 토큰 반환
        return authHeader.replace('Bearer ', '');

    } catch (error) {
        console.error('토큰 갱신 실패:', error);
        throw error;
    }
}; 