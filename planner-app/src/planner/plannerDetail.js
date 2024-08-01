import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './css/detail.css';  // Import the CSS file

export default function PlannerDetail() {
  const [planner, setPlanner] = useState({});
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [details, setDetails] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
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
        res && res.status === 200 && navigate(-1);
      })
      .catch((err) => console.log(err));
  };

  const deleteButtonClick = (e) => {
    e.preventDefault();

    axios
      .delete(`http://localhost:8080/api/planner/${plannerIdx}`)
      .then((res) => {
        res && res.status === 204 && navigate(-1);
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
      <div className="planner-container">
        <h2 className="planner-title">일정 계획 상세</h2>
        <form id="frm" method="post" encType="multipart/form-data" className="planner-form">
          <input type="hidden" id="plannerIdx" name="plannerIdx" value={planner.plannerIdx || ""} />

          <table className="board-detail">
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
                <td colSpan="3">{planner.creatorId}</td>

              </tr>
              <tr>
                <th scope="row">제목</th>
                <td colSpan="3">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="input-field"
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
                    className="input-field"
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
                    className="input-field"
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
                    className="input-field"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <th scope="row">상세 설명</th>
                <td colSpan="4">
                  <textarea
                    id="details"
                    name="details"
                    className="textarea-field"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  ></textarea>
                </td>
              </tr>
              <tr>

                <td colSpan="4">
                  <textarea
                    id="contents"
                    name="contents"
                    className="textarea-field"
                    value={contents}
                    onChange={(e) => setContents(e.target.value)}
                  ></textarea>
                </td>
              </tr>

            </tbody>
          </table>
        </form>
      
        <div className="button-group">
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
      </div>
    </>
  );
}
