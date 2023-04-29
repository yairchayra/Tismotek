import './App.css';
import Socialnav from './components/Socialnav';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import Events from './components/Events';
import Contacts from './components/Contacts';
import Donations from './components/Donations';
import {Route,Routes} from "react-router-dom"
// import db from './';

function App() {
  // console.log(db)
  return (
    <div className='App'>
      <Socialnav/>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/projects' element={<Projects/>}></Route>
        <Route path='/events' element={<Events/>}></Route>
        <Route path='/contacts' element={<Contacts/>}></Route>
        <Route path='/donations' element={<Donations/>}></Route>
      </Routes>
      <Footer/>
  </div>
    );
}

export default App;
