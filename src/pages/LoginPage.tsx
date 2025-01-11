import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LoginPage.css";
import { login as apiLogin } from "../services/loginService";
import { LoginRequest, LoginResponse } from "../api/loginApi";

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 현재 로그인한 사용자의 정보에 접근
  const { login: authLogin } = useAuth();    //user.email, user.name 등으로 접근 가능

  const handleSigninSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
        const loginData: LoginRequest = { email, password };
        const response = await apiLogin(loginData);
        
        authLogin({ email: response.email, name: email.split('@')[0] });
        navigate("/");
    } catch (error: any) {
        console.error('로그인 에러:', error);
        alert(error.message);
    }
  };

  return (
    <div className="container">
      <h1>로그인</h1>
      <ul className="links">
        <li className="active">
          <a href="#" id="signin">로그인</a>
        </li>
        <li>
          <a href="/signup">회원가입</a>
        </li>
      </ul>

      <form action="" method="post">
        <div className="input__block">
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input__block">
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="signin__btn" onClick={handleSigninSubmit}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default SignInPage; 