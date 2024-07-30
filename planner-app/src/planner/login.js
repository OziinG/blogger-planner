import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/loginProc", `username=${username}&password=${password}`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      // 응답에서 토큰 추출 및 로컬 스토리지에 저장
      const token = response.headers.token;
      localStorage.setItem("token", token);

      navigate("/planner");
    } catch (err) {
      setError("Invalid login credentials");
    }
  };

  return (
    <div className="container">
      <h1>로그인</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">계정명</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="ID를 입력하세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">암호</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="패스워드를 입력하세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input type="submit" value="로그인" />
          <input type="button" value="회원가입" onClick={() => navigate("/join")} />
        </div>
      </form>
    </div>
  );
};

export default Login;
