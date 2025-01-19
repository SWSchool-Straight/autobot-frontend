import * as React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/registerService";
import "../styles/LoginPage.css";
import { RegisterRequest } from "../api/registerApi";

const SignUpPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const formatBirthDate = (birthDate: string): string => {
    const year = birthDate.startsWith("0") || parseInt(birthDate.slice(0, 2)) >= 50 
      ? `19${birthDate.slice(0, 2)}` 
      : `20${birthDate.slice(0, 2)}`;
    const month = birthDate.slice(2, 4);
    const day = birthDate.slice(4, 6);
    return `${year}-${month}-${day}`;
  };

  const handleAuthCodeSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleSignupSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 데이터 유효성 검사
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

    console.log("회원가입 시도:", signupData); // 요청 데이터 확인

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
        {currentStep === 1 && (
          <>
            <div className="input__block">
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="auth__btn" onClick={handleAuthCodeSubmit}>
              인증 번호 받기
            </button>
          </>
        )}

        {currentStep >= 2 && (
          <>
            <div className="input__block">
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                disabled={true}
              />
            </div>
            {currentStep === 2 && (
              <>
                <div className="input__block">
                  <input
                    type="text"
                    placeholder="인증 번호 입력"
                    className="input"
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                  />
                </div>
                <button className="auth__btn" onClick={() => setCurrentStep(3)}>
                  인증 번호 확인
                </button>
              </>
            )}
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="input__block">
              <input
                type="password"
                placeholder="비밀번호"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input__block">
              <input
                type="text"
                placeholder="이름"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input__block">
              <input
                type="text"
                placeholder="생년월일 (주민번호 앞자리)"
                className="input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <div className="input__block">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="남성"
                  checked={gender === "남성"}
                  onChange={(e) => setGender(e.target.value)}
                />
                남성
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="여성"
                  checked={gender === "여성"}
                  onChange={(e) => setGender(e.target.value)}
                />
                여성
              </label>
            </div>
            <button className="signin__btn" onClick={handleSignupSubmit}>
              회원가입 하기
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignUpPage;
