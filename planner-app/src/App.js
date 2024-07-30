import React from 'react';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import Home from './planner/home';
import Login from './planner/login';
import Join from './planner/join';
import AdminIndex from './planner/adminIndex';
import PlannerList from './planner/plannerList';
import PlannerWrite from './planner/plannerWrite';
import PlannerDetail from './planner/plannerDetail';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/admin" element={<AdminIndex />} />
        <Route path="/planner" element={<PlannerList />} />
        <Route path="/write" element={<PlannerWrite />} />
        <Route path="planner/:plannerIdx" element={<PlannerDetail />} />
      </Routes>
    </>
  );
}

export default App;
