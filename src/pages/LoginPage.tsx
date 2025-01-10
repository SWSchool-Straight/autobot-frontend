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

  //회원가입 탭 클릭 
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
  
  //로그인 탭 클릭
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
  const formatBirthDate = (birthDate: string): string => {
    // 예: "990101" -> "1999-01-01"
    const year = birthDate.startsWith("0") || parseInt(birthDate.slice(0, 2)) >= 50 ? `19${birthDate.slice(0, 2)}` : `20${birthDate.slice(0, 2)}`;
    const month = birthDate.slice(2, 4);
    const day = birthDate.slice(4, 6);
    return `${year}-${month}-${day}`;
  };
  //인증번호 입력 
  const handleAuthCodeSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentStep(2); // 다음 단계로 이동
  };

  //회원가입하기 
  const handleSignupSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://a1d3d281dc3244548a841a93ffa47702-1913065980.ap-northeast-2.elb.amazonaws.com/api/members/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          birthDate: formatBirthDate(birthDate), // 변환된 생년월일
          gender: gender === "남성" ? "M" : "F",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입 요청에 실패했습니다.");
      }

      alert("회원가입이 완료되었습니다!");
      setEmail("");
      setPassword("");
      setName("");
      setBirthDate("");
      setGender("");
      setCurrentStep(1); //단계 초기화 
      setIsSignUp(false); //로그인 탭으로 리디렉션
    } catch (error: any) {
      alert(error.message);
      setEmail("");
      setPassword("");
      setName("");
      setBirthDate("");
      setGender("");
    }
  };

  const handleSigninSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://a1d3d281dc3244548a841a93ffa47702-1913065980.ap-northeast-2.elb.amazonaws.com/api/members/login", {
        method: "POST",
        credentials: 'include', // 세션 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "아이디 또는 비밀번호가 잘못되었습니다.");
      }

      alert("로그인 성공!");
      window.location.href = "/";
    } catch (error: any) {
      alert(error.message);
      setEmail("");
      setPassword("");
    }
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
              {/* 회원가입 버튼튼 */}
              <button className="signin__btn" onClick={handleSignupSubmit}>
                회원가입 하기
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
          <button className="signin__btn" onClick={handleSigninSubmit}>
            로그인</button>
        </form>
      )}
    </div>
  );
};

export default SignInSignUp;


