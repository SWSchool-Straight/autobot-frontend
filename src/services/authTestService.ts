import { authTestApi } from '../test/authTestApi';

export const authTest = async () => {
    try {
        const response = await authTestApi(); // API 요청
        console.log('서버 응답 전체:', response.data);
        return response.data; // 응답 데이터 반환
    } catch (error) {
        const status = error.response?.status;
        if (status === 403) {
            throw new Error('로그인이 필요한 서비스입니다.');
        } else {
            throw new Error("서버와의 연결에 문제가 발생했습니다.");
        }
    }
};