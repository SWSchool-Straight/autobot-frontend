import axios from "axios";
import { LoginRequest, loginApi, setAccessToken } from "../api/loginApi";
import { authApiClient } from "../api/apiClient";
import { setCurrentEmail } from './refreshService';

// Hook들을 직접 사용하지 않고 함수의 매개변수로 받도록 수정
export const handleLoginSubmit = async(
    email: string,
    password: string,
    onLoginSuccess: (email: string, name: string) => void,
    onNavigate: (path: string) => void
): Promise<string | null> => {
    try {
        const loginData: LoginRequest = { email, password };
        const response = await handleLogin(loginData);
        
        onLoginSuccess(email, email.split('@')[0]);
        onNavigate("/");  // 홈 화면으로 이동
        console.log('로그인 성공:', response);
        return null;

    } catch (err: any) {
        return err.message;
    }
};

// 로그인 API 호출 함수
export const handleLogin = async (data: LoginRequest) => {
    try {
        console.log('로그인 요청 데이터:', data);   
        
        const response = await loginApi(data);
        console.log('서버 응답 전체:', response);
        console.log('응답 헤더:', response.headers);
        
        const authHeader = response?.headers['authorization'];
        
        if (!authHeader) {
            throw new Error('Authorization 헤더가 존재하지 않습니다.');
        }

        // Bearer 접두사 제거
        const accessToken = authHeader.replace('Bearer ', '');
        console.log('추출된 액세스 토큰:', accessToken);
        
        // Authorization 헤더 설정 (현재 세션용)
        setAccessToken(accessToken);
        
        // 기존 authApiClient의 헤더 확인
        console.log('설정된 Authorization 헤더:', authApiClient.defaults.headers.common['Authorization']);

        // 이메일 저장
        setCurrentEmail(data.email);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('로그인 에러:', {
                status: error.response?.status,
                headers: error.response?.headers,
                data: error.response?.data
            });
            
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 400) {
                if (message === "Email not found") {
                    throw new Error("이메일이 존재하지 않습니다.");
                } else if (message === "Incorrect password") {
                    throw new Error("비밀번호가 올바르지 않습니다.");
                }
            } else if (status === 401) {
                throw new Error("인증이 실패했습니다. 다시 시도해주세요.");
            }
            throw new Error(message || "로그인 요청에 실패했습니다.");
        }
        throw new Error("로그인 중 알 수 없는 오류가 발생했습니다.");
    }
}; 