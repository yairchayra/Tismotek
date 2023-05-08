import Socialnav from './Socialnav';
import Navbar from './Navbar';
import Footer from './Footer';
import Home from './Home';
import About from './About';
import Login from './Login';
import Projects from './Projects';
import Events from './Events';
import Contacts from './Contacts';
import Donations from './Donations';
import ProtectedRoute from "./ProtectedRoute";
import { UserAuthContextProvider } from "../context/UserAuthContext";
import {Outlet, Route,Routes} from "react-router-dom"
import Dashboard from './Dashboard';

function Router() {

  const Mainlayout = () =>{
    return(
      <>
      <Socialnav/>
      <Navbar />
      <Outlet/>
      <Footer/>
      </>
    );
  }
  return (
    <div className='Router'>
        <UserAuthContextProvider>
      <Routes>
      <Route path='/' element={<Mainlayout/>}>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About/>}></Route>
        <Route path='/projects' element={<Projects/>}></Route>
        <Route path='/events' element={<Events/>}></Route>
        <Route path='/contacts' element={<Contacts/>}></Route>
        <Route path='/donations' element={<Donations/>}></Route>
        </Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
      </Routes>
      </UserAuthContextProvider>
  </div>
    );
}

export default Router;
