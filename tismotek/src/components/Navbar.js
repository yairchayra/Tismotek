import './Navbar.css'
import logo from '../logos/logo.png'

function Navbar(){
    return (
        <nav className="Navbar">
            <div className="logo-container">
            <img src={logo} alt="Logo" />
            </div>

            <ul className="nav-links">
                <li><a href="/donations">תרומה</a></li>
                <li><a href="/contacts">צור קשר</a></li>
                <li><a href="/events">תוכניות</a></li>
                <li><a href="/projects">פרוייקטים</a></li>
                <li><a href="/about"> אודות תסמותק</a></li>
                <li><a href="/">דף הבית</a></li>
            </ul>
        </nav>
        );
}
export default Navbar;