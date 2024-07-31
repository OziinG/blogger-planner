import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <header>
      </header>
      <h2>홈 페이지 입니다.</h2>
      <p>
        Planner 웹 앱에 오신 것을 환영합니다. 이 웹 앱은 일정을 관리하고 계획을
        세우는 데 도움을 줍니다.
      </p>
      <h3>기능 소개</h3>
      <ul>
        <li>
          일정 관리: 새로운 일정을 추가하고 기존 일정을 수정하거나 삭제할 수
          있습니다.
        </li>
        <li>
          파일 첨부: 일정과 관련된 파일을 업로드하고 다운로드할 수 있습니다.
        </li>
        <li>
          사용자 관리: 사용자별로 일정을 관리하고 권한을 부여할 수 있습니다.
        </li>
      </ul>
      <div className="auth-links">
        <Link to="/login" className="btn">
          로그인
        </Link>
        <p />
        <Link to="/join" className="btn">
          회원가입
        </Link>
      </div>
      <footer>
        <p>&copy; 2024 Planner. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
