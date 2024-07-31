import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "../../node_modules/jwt-decode/build/cjs/index";
import "./list.css"

const PlannerList = () => {
  const [planners, setPlanners] = useState([]);
  const navigate = useNavigate();

  // JWT 토큰에서 사용자 정보를 추출
  const token = localStorage.getItem("token");
  let creatorId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    creatorId = decodedToken.sub; // 일반적으로 'sub' 클레임에 사용자 ID가 저장됩니다.
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/planner", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        res && res.data && setPlanners(res.data);
      })
      .catch((err) => console.log(err));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <>
      <div className="container">
        <h2>게시판 목록</h2>
        <p>{creatorId}님 안녕하세요!</p>
        <button onClick={handleLogout} className="btn">
          로그아웃
        </button>
        <table className="planner_list">
          <colgroup>
            <col width="15%" />
            <col width="*" />
            <col width="15%" />
            <col width="20%" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">글번호</th>
              <th scope="col">제목</th>
              <th scope="col">조회수</th>
              <th scope="col">작성일</th>
            </tr>
          </thead>
          <tbody>
            {planners.length !== 0 &&
              planners.map((planner) => (
                <tr key={planner.plannerIdx}>
                  <td>{planner.plannerIdx}</td>
                  <td className="title">
                    <Link to={`/planner/${planner.plannerIdx}`}>
                      {planner.title}
                    </Link>
                  </td>
                  <td>{planner.hitCnt}</td>
                  <td>{new Date(planner.createdDatetime).toLocaleDateString()}</td>
                </tr>
              ))}
            {planners.length === 0 && (
              <tr>
                <td colSpan="4">조회된 결과가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div>
          <Link to="/write" className="btn">
            글쓰기
          </Link>
          <Link to="/home" className="btn">
            메인화면으로
          </Link>
        </div>
      </div>
    </>
  );
};

export default PlannerList;
