import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { getDoc, doc, updateDoc, increment } from 'firebase/firestore';
import './Socialnav.css';
import DonationButton from './DonationButton';

function Socialnav() {
  const [editMode, setEditMode] = useState(false);
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

    const fetchLogoData = async () => {
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

    fetchSocialData();
    fetchLogoData();
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

  const handleSave = async (logo) => {
    setEditMode(false);

    // Save the updated links to the backend or perform any other necessary actions
    if (auth.currentUser) {
      try {
        const socialDocRef = doc(db, 'social', 'links');
        await updateDoc(socialDocRef, {
          youtube: youtubeLink,
          facebook: facebookLink,
          whatsapp: whatsappLink,
          instagram: instagramLink,
        });

        // Update the clicks document for the clicked logo
        const clicksDocRef = doc(db, 'social', 'clicks');
        await updateDoc(clicksDocRef, {
          [logo]: increment(1),
        });
      } catch (error) {
        console.log('Error saving social links:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <div className="social-nav">
      {auth.currentUser && editMode ? (
        <>
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
          <input
            type="text"
            value={facebookLink}
            onChange={(e) => setFacebookLink(e.target.value)}
          />
          <input
            type="text"
            value={whatsappLink}
            onChange={(e) => setWhatsappLink(e.target.value)}
          />
          <input
            type="text"
            value={instagramLink}
            onChange={(e) => setInstagramLink(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSave.bind(null, 'facebook')}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <a href={youtubeLink} target="_blank" rel="noreferrer">
            <img
              src={socialLogoUrl.youtubeLogo}
              alt="YouTube"
              title="Youtube"
              onClick={() => handleSave('youtube')}
            />
          </a>
          <a href={facebookLink} target="_blank" rel="noreferrer">
            <img
              src={socialLogoUrl.facebookLogo}
              alt="Facebook"
              title="Facebook"
              onClick={() => handleSave('facebook')}
            />
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <img
              src={socialLogoUrl.whatsappLogo}
              alt="WhatsApp"
              title="Whatsapp"
              onClick={() => handleSave('whatsapp')}
            />
          </a>
          <a href={instagramLink} target="_blank" rel="noreferrer">
            <img
              src={socialLogoUrl.instagramLogo}
              alt="Instagram"
              title="Instagram"
              onClick={() => handleSave('instagram')}
            />
          </a>
          {auth.currentUser && (
            <button className="btn btn-secondary" onClick={handleEdit}>
              {editMode ? 'Editing...' : 'ערוך קישורים'}
            </button>
          )}
          {auth.currentUser && (
            <Link to="/dashboard">
              <button className="btn btn-secondary">לאזור האישי</button>
            </Link>
          )}
          <div className='donation-social'>
          <DonationButton/>
          </div>
        </>
      )}
    </div>
  );
}

export default Socialnav;
