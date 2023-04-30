import './Navbar.css'
import logo from '../logos/logo.png'
import {Link,useMatch, useResolvedPath} from "react-router-dom"

function Navbar(){
    return (
        <nav className="Navbar">

            <div className="logo-container">
            <Link to="/">
            <img src={logo} alt="Logo" />
            </Link>
            </div>

            <ul className="nav-links">
                <CustomLink to="/donations">תרומה</CustomLink>
                <CustomLink to="/contacts">צור קשר</CustomLink>
                <CustomLink to="/events">פעילויות</CustomLink>
                <CustomLink to="/projects">פרוייקטים</CustomLink>
                <CustomLink to="/about"> אודות תסמותק</CustomLink>
                <CustomLink to="/">דף הבית</CustomLink>
            </ul>
        </nav>
        );
}
export default Navbar;
function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props}>
          {children}
        </Link>
      </li>
    )
  }