import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {BrowserRouter} from "react-router-dom"

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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
export default db;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
