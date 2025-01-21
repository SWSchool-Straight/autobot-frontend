import { emailVerificationApi } from "../api/emailVerificationApi";

export const sendVerificationEmail = async (email: string): Promise<void> => {
    try {
        await emailVerificationApi.sendVerificationEmail(email);
    } catch (error) {
        throw new Error("인증 메일 발송에 실패했습니다.");
    }
};

export const verifyEmailCode = async (email: string, code: string): Promise<boolean> => {
    try {
        const response = await emailVerificationApi.verifyEmailCode(email, code);
        return response.info?.isVerified || false;
    } catch (error) {
        throw new Error("인증번호가 올바르지 않습니다.");
    }
}; 