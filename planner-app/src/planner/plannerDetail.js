import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function PlannerDetail() {
  const [planner, setPlanner] = useState({});
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const refFiles = useRef();
  const { plannerIdx } = useParams();
  const navigate = useNavigate();

  const listButtonClick = (e) => {
    e.preventDefault();
    navigate("/planner");
  };

  const updateButtonClick = (e) => {
    e.preventDefault();

    const updatedPlanner = {
      title,
      contents,
      details,
      startDate,
      endDate,
      location,
    };

    axios
      .put(`http://localhost:8080/api/planner/${plannerIdx}`, updatedPlanner)
      .then((res) => {
        res && res.status === 200 && navigate("/planner");
      })
      .catch((err) => console.log(err));
  };

  const deleteButtonClick = (e) => {
    e.preventDefault();

    axios
      .delete(`http://localhost:8080/api/planner/${plannerIdx}`)
      .then((res) => {
        res && res.status === 204 && navigate("/planner");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/planner/${plannerIdx}`)
      .then((res) => {
        if (res.status === 200) {
          setPlanner(res.data);
          setTitle(res.data.title);
          setContents(res.data.contents);
          setDetails(res.data.details);
          setStartDate(res.data.startDate);
          setEndDate(res.data.endDate);
          setLocation(res.data.location);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          console.log(err.response.data.message);
        } else {
          console.log(err);
        }
      });
  }, [plannerIdx]);

  return (
    <>
      <div className="container">
        <h2>게시판 상세</h2>
        <form id="frm" method="post" enctype="multipart/form-data" >
          <input type="hidden" id="plannerIdx" name="plannerIdx" value={planner.plannerIdx} />

          <table className="board_detail">
            <colgroup>
              <col width="15%" />
              <col width="*" />
              <col width="15%" />
              <col width="35%" />
            </colgroup>
            <tbody>
              <tr>
                <th scope="row">글 번호</th>
                <td>{planner.plannerIdx}</td>
                <th scope="row">조회수</th>
                <td>{planner.hitCnt}</td>
              </tr>
              <tr>
                <th scope="row">작성자</th>
                <td>{planner.creatorId}</td>
                <th scope="row">작성일</th>
                <td>{planner.createDatetime}</td>
              </tr>
              <tr>
                <th scope="row">제목</th>
                <td colSpan="3">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">시작 날짜</th>
                <td colSpan="3">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">종료 날짜</th>
                <td colSpan="3">
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">지역</th>
                <td colSpan="3">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="4">
                  <textarea
                    id="contents"
                    name="contents"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                  ></textarea>
                </td>
              </tr>
              <tr>
                <th scope="row">상세 설명</th>
                <td colSpan="4">
                  <textarea
                    id="details"
                    name="details"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      

        <input
          type="button"
          id="list"
          className="btn"
          value="목록으로"
          onClick={listButtonClick}
        />
        <input
          type="button"
          id="update"
          className="btn"
          value="수정하기"
          onClick={updateButtonClick}
        />
        <input
          type="button"
          id="delete"
          className="btn"
          value="삭제하기"
          onClick={deleteButtonClick}
        />
      </div>
    </>
  );
}
