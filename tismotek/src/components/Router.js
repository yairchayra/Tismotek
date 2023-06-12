import React from 'react';
import Socialnav from './Socialnav';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Login from './Login';
import Projects from './Projects';
import Events from './Events';
import Contacts from './Contacts';
import ProtectedRoute from './ProtectedRoute';
import SignUpForm from './SignUpForm';
import AddEvent from './AddEvent';
import { UserAuthContextProvider } from '../context/UserAuthContext';
import { Outlet, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import SocialData from './SocialData';
import EventsData from './EventsData';
import SideBar from './SideBar';
import DonationButton from './DonationButton';
import './Adminlayout.css';
import './Mainlayout.css';

function Router() {
  const Mainlayout = () => {
    return (
      <>
        <Socialnav />
        <Navbar />
        <Outlet />
        <Footer />
        <div className='donation-button'>
      <DonationButton/>
      </div>
      </>
    );
  };

  const Adminlayout = () => {
    return (
      <div className="admin-layout-container">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  };

  return (
    <div className="Router">
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<Mainlayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/login" element={<Login />} />
            <Route
              exact
              path="/events/signup/:eventId"
              element={<SignUpForm />}
            />
            <Route exact path="/events/add" element={<ProtectedRoute><AddEvent /></ProtectedRoute>} />
          </Route>
          <Route path="/dashboard" element={<Adminlayout />}>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/socialData" element={<SocialData />} />
            <Route path="/dashboard/eventsData" element={<EventsData />} />
          </Route>
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default Router;
