// 로그인 요청 데이터 타입
export interface LoginRequest {
    email: string;
    password: string;
}

// 로그인 응답 데이터 타입
export interface LoginResponse {
    email: string;
}