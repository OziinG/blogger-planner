import { useState, useRef } from "react";
import axios from "axios";

export default function PlannerWrite() {
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [details, setDetails] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const refFiles = useRef();

    const changeTitle = e => setTitle(e.target.value);
    const changeContents = e => setContents(e.target.value);
    const changeDetails = e => setDetails(e.target.value);
    const changeStartDate = e => setStartDate(e.target.value);
    const changeEndDate = e => setEndDate(e.target.value);
    const changeLocation = e => setLocation(e.target.value);

    const [files, setFiles] = useState([]);
    const handlerChangeFiles = e => {
        const files = e.target.files;

        if (files.length > 3) {
            alert('이미지는 최대 3개까지만 업로드 가능합니다.');
            refFiles.current.value = '';
            setFiles([]);
            return;		
        }

        setFiles([...files]);
    };

    const formData = new FormData();
    formData.append('title', title);
    formData.append('contents', contents);
    formData.append('details', details);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('location', location);

    Object.values(files).forEach(file => formData.append('files', file));

        axios({
            method: 'POST',
            url: 'http://localhost:8080/api/planner',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => console.log(err));
    };

    return (
        <div className="container">
            <h2>플래너 작성</h2>
            <form id="frm" onSubmit={handlerSubmit} encType="multipart/form-data">
                <table className="board_detail">
                    <tbody>
                    <tr>
                        <td>제목</td>
                        <td><input type="text" id="title" name="title" value={title} onChange={changeTitle} required /></td>
                    </tr>
                    <tr>
                        <td>요약 설명</td>
                        <td><textarea id="contents" name="contents" value={contents} onChange={changeContents} required></textarea></td>
                    </tr>
                    <tr>
                        <td>상세 설명</td>
                        <td><textarea id="details" name="details" value={details} onChange={changeDetails}></textarea></td>
                    </tr>
                    <tr>
                        <td>시작 날짜</td>
                        <td><input type="date" id="startDate" name="startDate" value={startDate} onChange={changeStartDate} required /></td>
                    </tr>
                    <tr>
                        <td>종료 날짜</td>
                        <td><input type="date" id="endDate" name="endDate" value={endDate} onChange={changeEndDate} required /></td>
                    </tr>
                    <tr>
                        <td>지역</td>
                        <td><input type="text" id="location" name="location" value={location} onChange={changeLocation} required /></td>
                    </tr>
                    </tbody>
                </table>
                <input ref={refFiles} onChange={handlerChangeFiles} type="file" id="files" name="files" multiple="multiple" />
                <input type="submit" id="submit" value="저장" className="btn" />
            </form>
        </div>
    );
}
