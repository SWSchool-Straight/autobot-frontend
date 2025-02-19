import { RegisterRequest } from "../types/register";

export const formatBirthDate = (birthDate: string): string => {
    if (/^\d{6}$/.test(birthDate)) {
        const year = parseInt(birthDate.substring(0, 2));
        const month = birthDate.substring(2, 4);
        const day = birthDate.substring(4, 6);
        
        const currentYear = new Date().getFullYear() % 100;
        const fullYear = year > currentYear ? 1900 + year : 2000 + year;
        
        return `${fullYear}-${month}-${day}`;
    }
    return birthDate;
};

export const validateRegisterData = (data: RegisterRequest): void => {
    if (!data.email || !data.email.includes('@') || data.email.length > 100) {
        throw new Error("이메일 형식이 올바르지 않습니다.");
    }
    if (!data.password || data.password.length < 4 || data.password.length > 100) {
        throw new Error("비밀번호는 4자 이상 100자 이하여야 합니다.");
    }
    if (!data.name || data.name.length > 50) {
        throw new Error("이름은 50자 이하여야 합니다.");
    }
    if (!data.birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(data.birthDate)) {
        throw new Error("생년월일 형식이 올바르지 않습니다. (YYMMDD 또는 YYYY-MM-DD)");
    }
    if (!data.gender || !["M", "F"].includes(data.gender)) {
        throw new Error("성별은 'M' 또는 'F'여야 합니다.");
    }
}; 