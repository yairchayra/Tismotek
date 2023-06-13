import React,{useState,useEffect} from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router";
import { useUserAuth } from "../context/UserAuthContext";
import {  db,auth } from '../firebase';

import { getDoc, doc } from 'firebase/firestore';
import Subscribe from './Subscribe'


function Footer() {
  const { logOut } = useUserAuth();
  const [donationLink, setDonationLink] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [contactData, setContactData] = useState(null);
  const [socialData, setSocialData] = useState({
    youtube: '',
    facebook: '',
    whatsapp: '',
    instagram: '',
  });
  const [youtubeLink, setYoutubeLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [socialLogoUrl, setSocialLogoUrl] = useState({
    youtubeLogo: '',
    facebookLogo: '',
    whatsappLogo: '',
    instagramLogo: '',
  });


  useEffect(() => {

    fetchDonationData();
    fetchLogoData();
    fetchContactData();
    fetchSocialData();
   fetchSocialLogoData();

  }, []);
  useEffect(() => {
    if (
      socialData.youtube !== '' &&
      socialData.facebook !== '' &&
      socialData.whatsapp !== '' &&
      socialData.instagram !== ''
    ) {
      setYoutubeLink(socialData.youtube);
      setFacebookLink(socialData.facebook);
      setWhatsappLink(socialData.whatsapp);
      setInstagramLink(socialData.instagram);
    }
  }, [socialData]);
  const fetchSocialData = async () => {
    try {
      const docRef = doc(db, 'social', 'links');
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        setSocialData(docSnapshot.data());
      }
    } catch (error) {
      console.error('Error fetching social data:', error);
    }
  };

  const fetchSocialLogoData = async () => {
    try {
      const docRef = doc(db, 'logos', 'links');
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const logoData = docSnapshot.data();
        setSocialLogoUrl({
          youtubeLogo: logoData.youtubeUrl || '',
          facebookLogo: logoData.facebookUrl || '',
          whatsappLogo: logoData.whatsappUrl || '',
          instagramLogo: logoData.instagramUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching logo data:', error);
    }
  };

  const fetchContactData = async () => {
    try {

      const docRef = doc(db, 'contacts', 'info');
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {

        setContactData(docSnapshot.data());

      }
    } catch (error) {
      console.log('Error fetching contact data:', error);
    }
  };
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

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const getFormattedLink = () => {
    if (donationLink.startsWith('http://') || donationLink.startsWith('https://')) {
      return donationLink.substr(donationLink.indexOf('//') + 2);
    }
    return donationLink;
  };
  return (
    <footer className="footer">

<div className='subscribe-container-footer'><Subscribe/></div>
          <div className='contant-footer-container'>
            <h5>צור קשר</h5>
            {contactData&&
          <ul className='contant-ul'>


        <li>
        { contactData.mail} :אימייל
        </li>
        <li>
         {contactData.phone} :טלפון
        </li>
        <li>
      כתובת: {contactData.location}
        </li>

      </ul>
}
        {socialData&&socialLogoUrl&&
        <ul className='pages-footer'>
           <div className='social-links-footer'>
          <a href={youtubeLink} target="_blank" rel="noreferrer">
            <img
              src={socialLogoUrl.youtubeLogo}
              alt="YouTube"
              title="Youtube"
            />
          </a>
          <a href={facebookLink} target="_blank" rel="noreferrer">
            <img
              src={socialLogoUrl.facebookLogo}
              alt="Facebook"
              title="Facebook"
            />
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <img
              src={socialLogoUrl.whatsappLogo}
              alt="WhatsApp"
              title="Whatsapp"
            />
          </a>
          <a href={instagramLink} target="_blank" rel="noreferrer">
            <img
              src={socialLogoUrl.instagramLogo}
              alt="Instagram"
              title="Instagram"
            />
          </a>
          </div>
          </ul>}

          </div>

      <div className='bottom-navBar'>
      <h5>עמודים</h5>
      <ul className='footer-links'>
        <CustomLink to="/"  >דף הבית</CustomLink>
        <CustomLink to="/about"  >אודות תסמותק</CustomLink>
        <CustomLink to="/projects"  >פרוייקטים</CustomLink>
        <CustomLink to="/events"  >פעילויות</CustomLink>
        <CustomLink to="/contacts"  >צור קשר</CustomLink>

        <li>
          <a href={`http://${getFormattedLink()}`}>תרומה</a>
        </li>
      </ul>
      </div>
      <div className='footer-right-container'>
      <div className="logo-container-footer">
        <Link to="/">
          <img src={logoUrl} alt="Logo" title="דף הבית" />
        </Link>
      </div>
      <div className="user-container-footer">
        {auth.currentUser ? (
          <button type="button" className=" btn btn-danger" onClick={handleLogout}>התנתק</button>
        ) : (
          <Link to="/login">כניסת מנהל</Link>
        )}
      </div>
      </div>
    </footer>
  );
}

function CustomLink({ to, children, ...props }) {
  return (
    <li>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}

export default Footer;
