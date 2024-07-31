import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './dashboard.css';

const Dashboard = () => {
  const [todaysEvents, setTodaysEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [importantEvents, setImportantEvents] = useState([]);
  const today = new Date().setHours(0, 0, 0, 0);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/planner", {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
    .then((res) => {
      const events = res.data.map(event => ({
        ...event,
        startDate: new Date(event.startDate).setHours(0, 0, 0, 0),
        endDate: new Date(event.endDate).setHours(0, 0, 0, 0),
      }));
      const todayEvents = events.filter(event => event.startDate === today);
      const upcoming = events.filter(event => event.startDate > today && event.endDate > today);
      const important = events.filter(event => event.endDate < today);

      setTodaysEvents(todayEvents);
      setUpcomingEvents(upcoming);
      setImportantEvents(important);
    })
    .catch((err) => console.log(err));
}, [today]);

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
          <Link to="/planner">Planner</Link>
          <Link to="/profile">Profile</Link>
          <span className="logout-link" onClick={handleLogout}>Logout</span>
        </nav>
      </header>
      <main>
        <section className="overview">
          <h2>Today's Overview</h2>
          <div className="overview-cards">
            <div className="card">
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
                        <td>{event.title}</td>
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
            <div className="card">
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
                        <td>{event.title}</td>
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
            <div className="card">
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
                        <td>{event.title}</td>
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
