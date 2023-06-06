import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import Router from './components/Router';
import DonationButton from './components/DonationButton';


function App() {

  return (
    <div className='App'>
      <Router/>
      <div className='donation-button'>
      <DonationButton/>
      </div>
  </div>
    );
}

export default App;

