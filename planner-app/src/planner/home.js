import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-links">
          <Link to="/login">LOGIN</Link> / <Link to="/join">JOIN</Link>
        </div>
      </header>
      <div className="home-content">
        <h2>What You Do</h2>
        <p>This is a Sample message,</p>
        <p>Have a nice day.</p>
        <div className="arrow-down">
          <span>&#9660;</span>
        </div>
        <p>This is a Sample message,</p>
        <p>Have a nice day.</p>
      </div>
    </div>
  );
};

export default Home;
