import React from 'react';
import { Link } from 'react-router-dom';
import './PlannerHeader.css';

const PlannerHeader = () => {
  const token = localStorage.getItem('token');

  return (
    <header className="header">
      <h1>
        {token ? (
          <Link to="/planner">Planner</Link>
        ) : (
          <Link to="/home">Planner</Link>
        )}
      </h1>
    </header>
  );
};

export default PlannerHeader;
