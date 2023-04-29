import './Socialnav.css'

function Socialnav() {
    const logos = require.context('../logos', true);
    return (
        <div className="social-nav">
        <a href="https://www.facebook.com/"><img src={logos('./facebook.png')} alt="Facebook" /></a>
        <a href="https://www.whatsapp.com/"><img src={logos('./whatsapp.png')} alt="WhatsApp" /></a>
        <a href="https://www.youtube.com/"><img src={logos('./youtube.png')} alt="YouTube" /></a>
      </div>
    );
}

export default Socialnav;
