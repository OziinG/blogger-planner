import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "../../node_modules/jwt-decode/build/cjs/index";


export default function PlannerWrite() {
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [details, setDetails] = useState('');

    const navigate = useNavigate();

    const changeTitle = (e) => setTitle(e.target.value);
    const changeContents = (e) => setContents(e.target.value);
    const changeStartDate = (e) => setStartDate(e.target.value);
    const changeEndDate = (e) => setEndDate(e.target.value);
    const changeLocation = (e) => setLocation(e.target.value);
    const changeDetails = (e) => setDetails(e.target.value);

    // JWT 토큰에서 사용자 정보를 추출
    const token = localStorage.getItem('token');
    let creatorId = null;
    if (token) {
        const decodedToken = jwtDecode(token);
        creatorId = decodedToken.sub; // 일반적으로 'sub' 클레임에 사용자 ID가 저장됩니다.
    }

    const handlerSubmit = (e) => {
        e.preventDefault();

        const plannerDto = {
            title,
            contents,
            startDate,
            endDate,
            location,
            details,
            creatorId // Add creatorId to plannerDto
        };

        axios({
            method: 'POST', 
            url: 'http://localhost:8080/api/planner/write', 
            data: plannerDto, 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // JWT 토큰을 포함하여 전송
            }
        })
        .then(res => {
            console.log(res);
            if (res && res.status === 201) {
                navigate('/planner');
            }
        })
        .catch(err => {
            console.log(err);
            alert(err.response.data.message || "Error occurred while creating planner");
        });
    };

    return (
        <div className="container">
            <h2>게시판 등록</h2>
            <form id="frm" onSubmit={handlerSubmit}>
                <table className="board_detail">
                    <tbody>
                        <tr>
                            <td>제목</td>
                            <td><input type="text" id="title" name="title" onChange={changeTitle} value={title} /></td>
                        </tr>
                        <tr>
                            <td>시작 날짜</td>
                            <td><input type="date" id="startDate" name="startDate" onChange={changeStartDate} value={startDate} /></td>
                        </tr>
                        <tr>
                            <td>종료 날짜</td>
                            <td><input type="date" id="endDate" name="endDate" onChange={changeEndDate} value={endDate} /></td>
                        </tr>
                        <tr>
                            <td>지역</td>
                            <td><input type="text" id="location" name="location" onChange={changeLocation} value={location} /></td>
                        </tr>
                        <tr>
                            <td>상세 설명</td>
                            <td><textarea id="details" name="details" onChange={changeDetails} value={details}></textarea></td>
                        </tr>
                        <tr>
                            <td colSpan="2"><textarea id="contents" name="contents" onChange={changeContents} value={contents}></textarea></td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" id="submit" value="저장" className="btn" />
            </form>
        </div>
    );
}
