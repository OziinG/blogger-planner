import React from 'react';
import './PlannerHeader.css';
import { useNavigate } from '../../node_modules/react-router-dom/dist/index';

const PlannerHeader = () => {
  const navigate =useNavigate();
  const clickPlanner = (e) => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/home');
    }
  };
  return (
    <>
      <header className="header">
      <h1 className='h1-planner' onClick={clickPlanner}>Planner</h1>

      </header>
      <div className="main-content">
        {/* 메인 콘텐츠가 여기에 들어갑니다 */}
      </div>
    </>
  );
};

export default PlannerHeader;
