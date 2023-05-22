import React from 'react';
import './Footer.css';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import {  auth } from '../firebase';

function Footer() {
  const { logOut } = useUserAuth();
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
    <footer className="footer">
      <div className="container">
        {auth.currentUser ? (
          <button onClick={handleLogout}>התנתק</button>
        ) : (
          <CustomLink to="/login">התחברות</CustomLink>
        )}
      </div>
    </footer>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? 'active' : ''}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Footer;
