import React from "react";
import { Link } from "react-router-dom";
import "./css/home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-links">
          <Link to="/login">로그인</Link> / <Link to="/join">가입하기</Link>
        </div>
      </header>
      <div className="home-content">
        <h1>Planner Web Application</h1>
        <p>자신만의 계획을 작성하고 관리하세요.</p>
        <div className="features">
          <div className="feature">
            <h3>간편한 일정 관리</h3>
            <p>직관적인 인터페이스로 빠르게 일정과 할 일을 생성하고 관리하세요.</p>
          </div>
          <div className="feature">
            <h3>체계적인 정리</h3>
            <p>진행 상황을 추적하고 일정을 철저하게 관리하세요.</p>
          </div>
          <div className="feature">
            <h3>캘린더 기능</h3>
            <p>달력을 이용하여, 언제 어떤 일정이 있는지 확인하세요.</p>
          </div>
        </div>
      </div>
      <footer className="home-footer">
        <p>© 2024 플래너 서비스, sk-shieldus-rookies</p>
      </footer>
    </div>
  );
};

export default Home;
