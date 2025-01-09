import React, { useState } from "react";
import "/src/styles/LoginPage.css"; // 스타일 정의 파일

const SignInSignUp: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 단계 관리
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    // 상태 초기화
    setEmail("");
    setAuthCode("");
    setPassword("");
    setName("");
    setBirthDate("");
    setGender("");
    setCurrentStep(1);
  
    setIsSignUp(true);
  };
  
  const handleSignInClick = (e: React.MouseEvent) => {
    e.preventDefault();
  
    // 상태 초기화
    setEmail("");
    setAuthCode("");
    setPassword("");
    setName("");
    setBirthDate("");
    setGender("");
    setCurrentStep(1);
  
    setIsSignUp(false);
  };
  

  const handleAuthCodeSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(2); // 다음 단계로 이동
  };

  const handleFinalSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("가입이 완료되었습니다!");
  
    // 상태 초기화
    setEmail("");
    setAuthCode("");
    setPassword("");
    setName("");
    setBirthDate("");
    setGender("");
    setCurrentStep(1); // 단계 초기화
    
    // 로그인 탭으로 리디렉션
    setIsSignUp(false);
  };

  return (
    <div className="container">
      {/* Heading */}
      <h1>{isSignUp ? "회원가입" : "로그인"}</h1>

      {/* Links */}
      <ul className="links">
        <li className={!isSignUp ? "active" : ""}>
          <a href="#" id="signin" onClick={handleSignInClick}>
            로그인
          </a>
        </li>
        <li className={isSignUp ? "active" : ""}>
          <a href="#" id="signup" onClick={handleSignUpClick}>
            회원가입
          </a>
        </li>
      </ul>

      {/* Form */}
      {isSignUp ? (
        <form action="" method="post">
        {currentStep === 1 && (
          <>
            {/* Email input */}
            <div className="input__block">
              <input
                type="email"
                placeholder="Email"
                className="input"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* Auth code button */}
            <button className="auth__btn" onClick={handleAuthCodeSubmit}>
              인증 번호 받기
            </button>
          </>
        )}

        {currentStep >= 2 && (
          <>
            {/* Email input (disabled) */}
            <div className="input__block">
              <input
                type="email"
                placeholder="Email"
                className="input"
                id="email"
                value={email}
                disabled={true} // 수정 불가능하게 고정
              />
            </div>
            {/* Auth code input */}
            {currentStep === 2 && (
              <div className="input__block">
                <input
                  type="text"
                  placeholder="인증 번호 입력"
                  className="input"
                  id="authCode"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                />
              </div>
            )}
            {/* Next button */}
            {currentStep === 2 && (
              <button className="auth__btn" onClick={() => setCurrentStep(3)}>
                인증 번호 확인
              </button>
            )}
          </>
        )}


          {currentStep === 3 && (
            <>
              {/* Password input */}
              <div className="input__block">
                <input
                  type="password"
                  placeholder="비밀번호"
                  className="input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {/* Name input */}
              <div className="input__block">
                <input
                  type="text"
                  placeholder="이름"
                  className="input"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* Birth date input */}
              <div className="input__block">
                <input
                  type="text"
                  placeholder="생년월일 (주민번호 앞자리)"
                  className="input"
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              {/* Gender input */}
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
              {/* Final submit button */}
              <button className="signin__btn" onClick={handleFinalSubmit}>
                가입하기
              </button>
            </>
          )}
        </form>
      ) : (
        <form action="" method="post">
          {/* Email input */}
          <div className="input__block">
            <input
              type="email"
              placeholder="Email"
              className="input"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Password input */}
          <div className="input__block">
            <input
              type="password"
              placeholder="Password"
              className="input"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Sign in button */}
          <button className="signin__btn">로그인</button>
        </form>
      )}
    </div>
  );
};

export default SignInSignUp;


