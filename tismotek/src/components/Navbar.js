import './Navbar.css';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import {RxHamburgerMenu } from "react-icons/rx";

function Navbar() {
  const [donationLink, setDonationLink] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchDonationData();
    fetchLogoData();
  }, []);

  const fetchDonationData = async () => {
    try {
      const docRef = doc(db, 'donation', 'link');
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setDonationLink(docSnapshot.data().url);
      }
    } catch (error) {
      console.log('Error fetching donation link:', error);
    }
  };

  const fetchLogoData = async () => {
    try {
      const docRef = doc(db, 'logos', 'links');
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setLogoUrl(docSnapshot.data().mainUrl);
      }
    } catch (error) {
      console.log('Error fetching logo data:', error);
    }
  };

  const getFormattedLink = () => {
    if (donationLink.startsWith('http://') || donationLink.startsWith('https://')) {
      return donationLink.substr(donationLink.indexOf('//') + 2);
    }
    return donationLink;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`Navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="logo-container">
        <Link to="/">
          <img src={logoUrl} alt="Logo" title="דף הבית" />
        </Link>
      </div>

      <div className="mobile-menu-button" onClick={toggleMobileMenu}>
        <RxHamburgerMenu />
      </div>

      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <li>
          <a href={`http://${getFormattedLink()}`}>תרומה</a>
        </li>
        <CustomLink to="/contacts"  setIsMobileMenuOpen={setIsMobileMenuOpen}>צור קשר</CustomLink>
        <CustomLink to="/events"  setIsMobileMenuOpen={setIsMobileMenuOpen}>פעילויות</CustomLink>
        <CustomLink to="/projects"  setIsMobileMenuOpen={setIsMobileMenuOpen}>פרוייקטים</CustomLink>
        <CustomLink to="/about"  setIsMobileMenuOpen={setIsMobileMenuOpen}>אודות תסמותק</CustomLink>
        <CustomLink to="/"  setIsMobileMenuOpen={setIsMobileMenuOpen}>דף הבית</CustomLink>
      </ul>
    </nav>
  );

}
// CustomLink component
function CustomLink({ to, children, setIsMobileMenuOpen, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  const handleClick = () => {
    setIsMobileMenuOpen(false); // Close the mobile menu when link is pressed
  };

  return (
    <li className={isActive && to !== '/' ? 'active' : ''}>
      <Link to={to} onClick={handleClick} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
