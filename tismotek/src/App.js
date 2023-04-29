import './App.css';
import Socialnav from './components/Socialnav';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import db from './';

function App() {
  // console.log(db)
  return (
    <div className='App'>
      <Socialnav/>
      <Navbar />
      <p>the rest</p>
      <Footer/>
  </div>
    );
}

export default App;
