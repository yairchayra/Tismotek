import './Footer.css';
import {Link,useMatch, useResolvedPath} from "react-router-dom"

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; 2023 MyWebsite.com</p>
        <CustomLink to="/login">התחברות</CustomLink>
      </div>
    </footer>
  );
}

export default Footer;
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
