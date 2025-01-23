import * as React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/registerService";
import { formatBirthDate } from "../utils/validators";
import { RegisterRequest } from "../api/registerApi";
import "../styles/LoginPage.css";

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        birthDate: "",
        gender: ""
    });
    const navigate = useNavigate();

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
        <div className="container">
            <h1>회원가입</h1>
            <ul className="links">
                <li>
                    <a href="/login">로그인</a>
                </li>
                <li className="active">
                    <a href="#" id="signup">회원가입</a>
                </li>
            </ul>

            <form action="" method="post">
                <div className="input__block">
                    <input
                        type="email"
                        placeholder="Email"
                        className="input"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input__block">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        className="input"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input__block">
                    <input
                        type="text"
                        placeholder="이름"
                        className="input"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input__block">
                    <input
                        type="text"
                        placeholder="생년월일 (주민번호 앞자리)"
                        className="input"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="input__block">
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="남성"
                            checked={formData.gender === "남성"}
                            onChange={handleInputChange}
                        />
                        남성
                    </label>
                    <label>
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
                <button className="signin__btn" onClick={handleRegisterSubmit}>
                    회원가입 하기
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;
