import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/LoginPage.css";

const BASE_URL = import.meta.env.VITE_LOGIN_BASE_URL;

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 현재 로그인한 사용자의 정보에 접근
  const { login, user } = useAuth();    //user.email, user.name 등으로 접근 가능

  const handleSigninSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/members/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // 에러 응답의 경우 JSON으로 에러 메시지가 옴
        const errorData = await response.json();
        throw new Error(errorData.message || "로그인에 실패했습니다.");
      }

      /**
       * [ Todo ]
       * 성공 시에는 body가 없으므로 임시 사용자 정보 생성
       * 실제로는 /api/members/me 같은 엔드포인트로 사용자 정보를 따로 요청해야 할 수 있습니다
       */
      const userData = {
        email: email,
        name: email.split('@')[0]  // 임시로 이메일 앞부분을 이름으로 사용
      };

      login(userData);
      navigate("/");
    } catch (error: any) {
      console.error('로그인 에러:', error);
      alert(error.message);
      setEmail("");
      setPassword("");
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