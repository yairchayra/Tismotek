import './Login.css'
import React, { useState } from "react";
import {  Link,useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import logo from '../logos/logo.png'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("אימייל/סיסמה שגויים");
    }
  };



  return (
    <>
      <div className="p-4 box">
      <div className="logo-container">
            <Link to="/">
            <img src={logo} alt="Logo" title='דף הבית' />
            </Link>
            </div>

        <h2 className="Auth-form-title">כניסת מערכת</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} className='Auth-form'>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="כתובת אימייל"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="סיסמה"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit" className="btn">
              התחבר
            </Button>
          </div>
        </Form>
        </div>

    </>
  );
};

export default Login;