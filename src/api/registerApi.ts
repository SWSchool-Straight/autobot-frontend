// 회원가입 API
export interface RegisterRequest {
    email: string;
    password: string;
    birthDate: string;
    gender: "M" | "F";
    name: string;
}

export interface RegisterResponse {
    memberName: string;
    message: string;
    memberId: number;
} 