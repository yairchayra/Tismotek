import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import DataManagment from './DataManagment';
import './Dashboard.css';

const Dashboard = () => {
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
    <div className="Dashboard-con">
      <div className="userwelcome-con">
        Welcome Admin <br />
        {user && user.email}
      </div>
      <DataManagment/>
      <div className="logout-con">
        <Button variant="primary" onClick={handleLogout}>
          התנתק
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
