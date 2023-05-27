import './Navbar.css'
import {Link,useMatch, useResolvedPath} from "react-router-dom"

function Navbar(){
    return (
        <nav className="Navbar">

            <div className="logo-container">
            <Link to="/">
            <img src='https://firebasestorage.googleapis.com/v0/b/tismotek-jce-23.appspot.com/o/logos%2Flogo.png?alt=media&token=7e40d507-1ba8-4ddb-9e75-4f172df2f5d0' alt="Logo" title='דף הבית' />
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