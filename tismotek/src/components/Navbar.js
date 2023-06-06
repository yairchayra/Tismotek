import './Navbar.css';
import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

function Navbar() {
  const [donationLink, setDonationLink] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

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

  return (
    <nav className="Navbar">
      <div className="logo-container">
        <Link to="/">
          <img src={logoUrl} alt="Logo" title="דף הבית" />
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <a href={`http://${getFormattedLink()}`}>תרומה</a>
        </li>
        <CustomLink to="/contacts">צור קשר</CustomLink>
        <CustomLink to="/events">פעילויות</CustomLink>
        <CustomLink to="/projects">פרוייקטים</CustomLink>
        <CustomLink to="/about">אודות תסמותק</CustomLink>
        <CustomLink to="/">דף הבית</CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive && to !== '/' ? 'active' : ''}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Navbar;
