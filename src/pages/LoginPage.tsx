import * as React from 'react';
import { useState } from "react";
import "../styles/LoginPage.css";
import { handleLoginSubmit } from '../services/loginService';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errMessage = await handleLoginSubmit(
      email, 
      password,
      login,
      (path) => navigate(path),
    );
    if (errMessage) {
      setError(errMessage);
      console.error(errMessage);
    }
  };

  return (
    <div className="container">
      <div className="auth-header">
        <button onClick={handleBack} className="back-button">
          ← 뒤로가기
        </button>
        <h1>로그인</h1>
      </div>

      <form onSubmit={onSubmit}>
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
        <button className="signin__btn">
          로그인
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      
      <div className="auth-links">
        <a href="/signup">아직 계정이 없으신가요? 회원가입 하러 가기</a>
      </div>
    </div>
  );
};

export default LoginPage; 
