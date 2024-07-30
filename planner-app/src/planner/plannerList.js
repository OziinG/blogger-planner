import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PlannerList = () => {
  const [planners, setPlanners] = useState([]);
  
  useEffect(() => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem("token");
    
    axios
      .get("http://localhost:8080/api/planner", {
        headers: {
          Authorization: `Bearer ${token}`,  // Authorization 헤더에 토큰 추가
        },
      })
      .then((res) => {
        console.log(res);
        res && res.data && setPlanners(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <div className="container">
        <h2>게시판 목록</h2>
        <p>
          {/* 사용자 정보 표시를 위한 부분 */}
          {/* {session.user.username} ({session.user.name} / {session.user.email}) */}
        </p>
        <table className="board_list">
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
                    <Link to={`/detail/${planner.plannerIdx}`}>
                      {planner.title}
                    </Link>
                  </td>
                  <td>{planner.hitCnt}</td>
                  <td>{planner.createdDatetime}</td>
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
          <p />
          <Link to={"/write"} className="btn">
            글쓰기
          </Link>
          <p />
          <Link to={"/home"} className="btn">
            메인화면으로
          </Link>
        </div>
      </div>
    </>
  );
};

export default PlannerList;
