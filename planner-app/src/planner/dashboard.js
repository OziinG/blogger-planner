import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/dashboard.css';
import { jwtDecode } from '../../node_modules/jwt-decode/build/cjs/index';

const Dashboard = () => {
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [importantEvents, setImportantEvents] = useState([]);
  
  const token = localStorage.getItem("token");
  let creatorId = null;
  let role = null;
  let name = null;

  
  if (token) {
    const decodedToken = jwtDecode(token);
    creatorId = decodedToken.sub; // 일반적으로 'sub' 클레임에 사용자 ID가 저장됩니다.
    name = decodedToken.name;
    role = decodedToken.role;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/planner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res && res.data) {
          // 역할에 따라 plannerList 설정
          const filteredPlanners = role === "ROLE_ADMIN"
            ? res.data
            : res.data.filter(planner => planner.creatorId === creatorId);
          // 날짜 필터링
          console.log(filteredPlanners)
          const today = new Date();
          today.setHours(0, 0, 0, 0); // 오늘 날짜의 시간을 00:00:00으로 설정

          const events = filteredPlanners.map(event => ({
            ...event,
            startDate: new Date(event.startDate).setHours(0, 0, 0, 0),
            endDate: new Date(event.endDate).setHours(0, 0, 0, 0),
          }));

          const todayEvents = events.filter(event => event.startDate === today.getTime());
          const upcoming = events.filter(event => event.startDate > today.getTime() && event.endDate > today.getTime());
          const endEvents = events.filter(event => today.getTime() - event.endDate > 0 && today.getTime() - event.endDate < 60 * 24 * 60 * 60 * 1000); // 60일을 밀리초로 변환하여 필터링

          setTodaysEvents(todayEvents);
          setUpcomingEvents(upcoming);
          setImportantEvents(endEvents);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [token, creatorId, role]); // 의존성 배열에 토큰, creatorId, 역할 추가

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/home";
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Planner Dashboard</h1>
        <nav>
          <Link to="/calendar">Calendar</Link>
          <span className="logout-link" onClick={handleLogout}>Logout</span>
        </nav>
      </header>
      <main>
      <h4>{name}님 안녕하세요!</h4>
        <section className="dash-overview">
          <h2>Today's Overview</h2>
          <div className="overview-dash-cards">
            <div className="dash-card">
              <h3>Today's Events</h3>
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysEvents.length > 0 ? (
                    todaysEvents.map(event => (
                      <tr key={event.plannerIdx}>
                        <td><Link to={`/planner/${event.plannerIdx}`}>
                      {event.title}
                    </Link></td>
                        <td>{event.location}</td>
                        <td>{event.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No events for today</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="dash-card">
              <h3>Upcoming Events</h3>
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map(event => (
                      <tr key={event.plannerIdx}>
                        <td><Link to={`/planner/${event.plannerIdx}`}>
                      {event.title}
                    </Link></td>
                        <td>{event.location}</td>
                        <td>{event.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No upcoming events</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="dash-card">
              <h3>End Events</h3>
              <table className="events-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {importantEvents.length > 0 ? (
                    importantEvents.map(event => (
                      <tr key={event.plannerIdx}>
                        <td><Link to={`/planner/${event.plannerIdx}`}>
                      {event.title}
                    </Link></td>
                        <td>{event.location}</td>
                        <td>{event.details}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">No important events</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section className="quick-links">
          <h2>Quick Links</h2>
          <div className="links">
            <Link to="/write">Add New Event</Link>
            <Link to="/planner">Manage To-Do List</Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
