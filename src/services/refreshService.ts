import { refreshTokenApi } from "../api/refreshTokenApi";
import { getCurrentEmail, setCurrentEmail } from "./loginService";


// 비즈니스 로직
export const getNewToken = async (logout: () => void): Promise<string> => {
    const email = getCurrentEmail(); // 이메일을 로컬 스토리지에서 가져오는 함수
    if (!email) {
        throw new Error("이메일이 설정되지 않았습니다."); // 이메일이 없을 경우 오류 발생
    }

    try {
        const response = await refreshTokenApi(email);
        const authHeader = response?.headers['authorization'];
        
        if (!authHeader) {
            throw new Error('Authorization 헤더가 존재하지 않습니다.');
        }

        // Bearer 접두사 제거 후 토큰 반환
        return authHeader.replace('Bearer ', '');

    } catch (error) {
        const status = error.response?.status;
        if (status === 403) {
            // 리프레시 토큰 만료 시 로그아웃 처리
            logout();
            throw new Error("리프레시 토큰이 유효하지 않거나 만료되었습니다.");
        }
        console.error('토큰 갱신 실패:', error);
        throw error;
    }
}; 