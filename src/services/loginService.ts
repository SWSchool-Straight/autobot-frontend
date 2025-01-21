import axios from "axios";
import { authApiClient } from "../api/apiClient";
import { ApiResponse } from "../api/apiReponse";
import { LoginRequest, login, setAccessToken } from "../api/loginApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// 현재 로그인한 사용자의 정보에 접근 (Context에서 가져오기)
const { login: authLogin } = useAuth();      //user.email, user.name 등으로 접근 가능
const navigate = useNavigate();

export const handleLoginSubmit = async(
    email: string,
    password: string
): Promise<string | null> => {
    try {
        const loginData: LoginRequest = { email, password };
        const response = await handleLogin(loginData);
        
        authLogin({ email: email, name: email.split('@')[0] });
        navigate("/");  // 홈 화면으로 이동
        console.log('로그인 성공:', response);
        return null; // 에러 없음을 나타냄

    } catch (err: any) {
        return err.message;
    }
  };
  
// 로그인 API 호출 함수
export const handleLogin = async (data: LoginRequest) => {
    try {
        const response = await login(data);  // loginApi.ts에서 호출
        const accessToken = response?.headers['authorization']; // headers에서 액세스 토큰 가져오기

        if (!accessToken) {
            throw new Error('Authorization 헤더가 존재하지 않습니다.');
        }
        
        // 추출한 토큰을 Axios 인스턴스에 설정
        setAccessToken(accessToken);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 401) {
                throw new Error("인증이 실패했습니다. 다시 시도해주세요.");
            } else if (status === 403) {
                throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
            }
            throw new Error(message || "로그인 요청에 실패했습니다.");
        }
        throw new Error("로그인 중 알 수 없는 오류가 발생했습니다.");
    }
}; 