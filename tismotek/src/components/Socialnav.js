import './Socialnav.css'

function Socialnav() {
    const logos = require.context('../logos', true);
    return (
        <div className="social-nav">
        <a href="https://www.youtube.com/@user-jn8uy1hw2w" target="_blank" rel="noreferrer"><img src={logos('./youtube.png')} alt="YouTube" title='Youtube' /></a>
        <a href="https://www.facebook.com/tismotek.co.il/?locale=he_IL" target="_blank" rel="noreferrer"><img src={logos('./facebook.png')} alt="Facebook" title='Facebook' /></a>
        <a href="https://chat.whatsapp.com/E4KoEm1r6Hy90x0CQUFXSa" target="_blank" rel="noreferrer"><img src={logos('./whatsapp.png')} alt="WhatsApp" title='Whatsapp'/></a>

      </div>
    );
}

export default Socialnav;
