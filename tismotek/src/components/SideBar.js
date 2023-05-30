import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";

import { Link } from "react-router-dom";
import './SideBar.css';

const SideBar = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
      <div className="sidebar">
      <div className="userwelcome-con">
          ברוכים הבאים<br />
          {user && user.email}
        </div>
        <div className="menu-container">
          <ul>
          <li>
          <Link to="/">דף הבית</Link>
            </li>
            <li>
              <Link to="/dashboard">אזור אישי</Link>
            </li>
            <li>
              <Link to="/dashboard/socialData">מידע רשתות חברתיות</Link>
            </li>
            <li>
              <Link to="/dashboard/eventsData">מידע אירועים</Link>
            </li>
          </ul>
        </div>
        <div className="logout-con">
          <Button variant="primary" onClick={handleLogout}>
            התנתק
          </Button>
        </div>

      </div>
  );
};

export default SideBar;
