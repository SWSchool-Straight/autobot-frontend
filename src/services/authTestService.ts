import { authTestApi } from '../test/authTestApi';

export const authTest = async () => {
    try {
        const response = await authTestApi(); // API 요청
        console.log('서버 응답 전체:', response.data);
    } catch (error) {
        if (error.response) {
            throw new Error(`API 요청 실패: ${error.response.data}`);
        } else {
            throw new Error("서버와의 연결에 문제가 발생했습니다.");
        }
    }
};