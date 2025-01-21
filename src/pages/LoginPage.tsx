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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errMessage = await handleLoginSubmit(
      email, 
      password,
      (email, name) => login({ email, name }),
      (path) => navigate(path)
    );
    if (errMessage) {
      setError(errMessage);
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

      <form action="" method="post" onSubmit={onSubmit}>
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
    </div>
  );
};

export default LoginPage; 