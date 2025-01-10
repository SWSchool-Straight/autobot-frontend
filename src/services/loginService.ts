import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_LOGIN_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
  withCredentials: true, // 기본 설정으로 쿠키 포함
});

// 회원가입 API 호출 함수
export const registerMember = async (data: any) => {
    try {
        const response = await apiClient.post("/members/register", data)
        console.log("응답 헤더:", response.headers); // 응답 헤더 출력
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
        console.error("에러 상세:", error.response?.data); // 에러 상세 로그
    }
    throw error.response?.data?.message || "회원가입 요청에 실패했습니다.";
  }
};

// 로그인 API 호출 함수
export const loginMember = async (data: any) => {
    try {
        const response = await apiClient.post("/members/login", data);
        console.log("응답 헤더:", response.headers); // 응답 헤더 출력
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
        console.error("에러 상세:", error.response?.data); // 에러 상세 로그
      }
      throw error.response?.data?.message || "로그인 요청에 실패했습니다.";
    }
};


