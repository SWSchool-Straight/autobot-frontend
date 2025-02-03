import * as React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/registerService";
import { formatBirthDate } from "../utils/validators";
import { RegisterRequest } from "../api/registerApi";
import "../styles/RegisterPage.css";

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        birthDate: "",
        gender: ""
    });
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegisterSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        const { email, password, name, birthDate, gender } = formData;
        if (!email || !password || !name || !birthDate || !gender) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        const signupData: RegisterRequest = {
            email,
            password,
            name,
            birthDate: formatBirthDate(birthDate),
            gender: gender === "남성" ? "M" : "F",
        };

        try {
            await register(signupData);
            alert("회원가입이 완료되었습니다!");
            navigate("/login");
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-header">
                <button onClick={handleBack} className="back-button">
                    ← 뒤로가기
                </button>
                <h1>회원가입</h1>
            </div>

            <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-block">
                    <input
                        type="email"
                        placeholder="이메일"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-block">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-block">
                    <input
                        type="text"
                        placeholder="이름"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input-block">
                    <input
                        type="text"
                        placeholder="생년월일 (YYMMDD)"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="radio-group">
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="gender"
                            value="남성"
                            checked={formData.gender === "남성"}
                            onChange={handleInputChange}
                        />
                        남성
                    </label>
                    <label className="radio-label">
                        <input
                            type="radio"
                            name="gender"
                            value="여성"
                            checked={formData.gender === "여성"}
                            onChange={handleInputChange}
                        />
                        여성
                    </label>
                </div>
                <button className="auth-button" onClick={handleRegisterSubmit}>
                    회원가입
                </button>
            </form>

            <div className="auth-links">
                <a href="/login">이미 계정이 있으신가요? 로그인하기</a>
            </div>
        </div>
    );
};

export default RegisterPage;
