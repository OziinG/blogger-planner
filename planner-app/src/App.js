import "./App.css";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import axios from 'axios';
import Login from "./planner/login";
import Home from "./planner/home";
import Join from "./planner/join";
import PlannerList from "./planner/plannerList";
import PlannerDetail from "./planner/plannerDetail";
import PlannerWrite from "./planner/plannerWrite";
import PrivateRoute from "./component/PrivateRoute";
import PlannerHeader from "./component/PlannerHeader";

// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:8080';
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
    <>
      <PlannerHeader />
      <div className="content">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          
          <Route 
            path="/planner" 
            element={
              <PrivateRoute>
                <PlannerList />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/planner/:plannerIdx" 
            element={
              <PrivateRoute>
                <PlannerDetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/write" 
            element={
              <PrivateRoute>
                <PlannerWrite />
              </PrivateRoute>
            } 
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
