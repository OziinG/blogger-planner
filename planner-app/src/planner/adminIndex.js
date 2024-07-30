import React from 'react';

const AdminIndex = () => {
    return (
        <div className="container">
            <h2>관리자 페이지 입니다.</h2>
            <h3>관리자 로그인 후 사용 가능합니다.</h3>
            <a href="/home">홈 페이지로 이동</a> 
            <a href="/planner">게시판 페이지로 이동</a> 
            <a href="/admin">관리자 페이지로 이동</a>
        </div>
    );
};

export default AdminIndex;
