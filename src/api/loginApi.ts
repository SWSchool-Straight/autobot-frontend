// 로그인 API
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    email: string;
    message: string;
}