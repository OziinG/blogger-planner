import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import './css/myCalendar.css';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "../../node_modules/jwt-decode/build/cjs/index";



const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plannerList, setPlannerList] = useState([]);
  const navigate = useNavigate();

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
    axios
      .get("http://localhost:8080/api/planner", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (role === "ROLE_ADMIN") {
          res && res.data && setPlannerList(res.data);
        } else {
          // If the user is not an admin, filter by creatorId
          const userPlanners = res.data.filter(
            (planner) => planner.creatorId === creatorId
          );
          setPlannerList(userPlanners);
        }
      })
      .catch((err) => console.log(err));
  }, [token, creatorId, role]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleCardClick = (eventId) => {
    navigate(`/planner/${eventId}`);
  };

  const filteredEvents = plannerList.filter(event => {
    const eventStartDate = new Date(event.startDate).setHours(0, 0, 0, 0);
    const eventEndDate = new Date(event.endDate).setHours(0, 0, 0, 0);
    const selectedDateTime = selectedDate.setHours(0, 0, 0, 0);
    return selectedDateTime >= eventStartDate && selectedDateTime <= eventEndDate;
  });

  return (
    <div className="calendar-container">
      <div className="calendar-left">
        <h2>Calendar</h2>
        <h4>{name}님 안녕하세요!</h4>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
        />
      </div>
      <div className="calendar-right">
        <h2>Events on {selectedDate.toDateString()}</h2>
        <div className="overview-cards">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.plannerIdx} className="card" onClick={() => handleCardClick(event.plannerIdx)}>
                <h3>{event.title}</h3>
                <div><strong>Location:</strong> {event.location}<p/><strong> Description:</strong> {event.details}</div>
              </div>
            ))
          ) : (
            <div className="card">
              <p>No events on this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCalendar;
