import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/write.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "../../node_modules/jwt-decode/build/cjs/index";

export default function PlannerWrite() {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [startString, setStartString] = useState("");
  const [endString, setEndString] = useState("");

  const navigate = useNavigate();

  const changeTitle = (e) => setTitle(e.target.value);
  const changeContents = (e) => setContents(e.target.value);
  const changeLocation = (e) => setLocation(e.target.value);
  const changeDetails = (e) => setDetails(e.target.value);

  // JWT 토큰에서 사용자 정보를 추출
  const token = localStorage.getItem("token");
  let creatorId = null;
  if (token) {
    const decodedToken = jwtDecode(token);
    creatorId = decodedToken.sub; // 일반적으로 'sub' 클레임에 사용자 ID가 저장됩니다.
  }

  const formatDateString = (date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const handleDateClick = (date) => {
    if (!startDate || date < startDate) {
      setStartDate(date);
      setStartString(formatDateString(date));
    } else {
      setEndDate(null);
      setEndDate(date);
      setEndString(formatDateString(date));
    }
  }// 기존 handleSubmit 함수 내의 날짜 변환 부분 수정
const handleSubmit = (e) => {
  e.preventDefault();

  // 날짜 조정 함수
  const adjustDateToLocal = (date) => {
    if (!date) return "";
    const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const plannerDto = {
    title,
    contents,
    startDate: adjustDateToLocal(startDate), // 로컬 시간대를 고려한 시작 날짜
    endDate: adjustDateToLocal(endDate),     // 로컬 시간대를 고려한 종료 날짜
    location,
    details,
    creatorId, 
  };

    axios
      .post("http://localhost:8080/api/planner", plannerDto, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT 토큰을 포함하여 전송
        },
      })
      .then((res) => {
        if (res && res.status === 201) {
          navigate("/planner");
        }
      })
      .catch((err) => {
        console.error(err);
        alert(
          err.response?.data?.message || "플래너 생성 중 오류가 발생했습니다."
        );
      });
  };

  return (
    <div className="container" style={{ marginTop: "80px" }}>
      <h2>새로운 일정 등록</h2>
      <form id="frm" onSubmit={handleSubmit}>
        <table className="board_detail">
          <tbody>
            <tr>
              <td>제목</td>
              <td>
                <input
                  type="text"
                  id="title"
                  name="title"
                  onChange={changeTitle}
                  value={title}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>날짜 선택</td>
              <td className="date-picker-container">
                <DatePicker
                  onChange={handleDateClick}
                  startDate={startDate}
                  endDate={endDate}
                  inline
                />
               <div className="date-display-container">
                  <div className="date-display">
                    <div>시작 날짜</div>
                    {startString !== "" ? startString : "시작 날짜를 선택하세요"}
                  </div>
                  <div className="date-display">
                     <div>종료 날짜</div>
                    {endString !== "" ? endString : "끝 날짜를 선택하세요"}
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td>지역</td>
              <td>
                <input
                  type="text"
                  id="location"
                  name="location"
                  onChange={changeLocation}
                  value={location}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>상세 설명</td>
              <td>
                <textarea
                  id="details"
                  name="details"
                  onChange={changeDetails}
                  value={details}
                  required
                ></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan="2">
                <textarea
                  id="contents"
                  name="contents"
                  onChange={changeContents}
                  value={contents}
                  required
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" id="submit" value="저장" className="btn" />
      </form>
    </div>
  );
}
