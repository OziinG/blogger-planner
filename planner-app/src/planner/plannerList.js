import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "../../node_modules/jwt-decode/build/cjs/index";
import "./css/list.css"

const PlannerList = () => {
  const [planners, setPlanners] = useState([]);

  // JWT 토큰에서 사용자 정보를 추출
  const token = localStorage.getItem("token");
  let creatorId = null;
  let name = null;
  let role = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    name = decodedToken.name; // 일반적으로 'sub' 클레임에 사용자 ID가 저장됩니다.
    creatorId = decodedToken.sub;
    role = decodedToken.role;
  }

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/planner", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (role === "ROLE_ADMIN") {
          // If the user is an admin, set all planners
          res && res.data && setPlanners(res.data);
        } else {
          // If the user is not an admin, filter by creatorId
          const userPlanners = res.data.filter(
            (planner) => planner.creatorId === creatorId
          );
          setPlanners(userPlanners);
        }
      })
      .catch((err) => console.log(err));
  }, [token, creatorId, role]);

  return (
    <>
      <div className="container">
        <h2>나의 일정 목록</h2>
        <h4>{name}님 안녕하세요!</h4>
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
              <th scope="col">여행지</th>
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
                  <td>{planner.location}</td>
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
          <Link to="/write" className="list-btn">
            글쓰기
          </Link>
        </div>
      </div>
    </>
  );
};

export default PlannerList;
