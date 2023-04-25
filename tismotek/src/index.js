import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADVQSdCnIVXDCFm1BvdI7WWRhzA4rOOoc",
  authDomain: "tismotek-jce-23.firebaseapp.com",
  projectId: "tismotek-jce-23",
  storageBucket: "tismotek-jce-23.appspot.com",
  messagingSenderId: "503059480074",
  appId: "1:503059480074:web:080f381acdfb397a5b29f3",
  measurementId: "G-9N4432FRVZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
