// 회원가입 요청 데이터 타입
export interface RegisterRequest {
    email: string;
    password: string;
    birthDate: string;
    gender: "M" | "F";
    name: string;
}

// 회원가입 응답 데이터 타입
export interface RegisterResponse {
    memberName: string;
    memberId: number;
}