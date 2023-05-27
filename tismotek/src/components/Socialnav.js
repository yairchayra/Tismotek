import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import './Socialnav.css';

function Socialnav() {
  const [editMode, setEditMode] = useState(false);
  const [socialData, setSocialData] = useState({ youtube: '', facebook: '', whatsapp: '', instagram: '' });
  const [youtubeLink, setYoutubeLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');


  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const DocRef = doc(db, 'social', 'links');
        const docSnapshot = await getDoc(DocRef);

        if (docSnapshot.exists()) {

          setSocialData(docSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);
  useEffect(() => {
    if (socialData.youtube !== '' && socialData.facebook !== '' && socialData.whatsapp !== '' && socialData.instagram !== '') {
      setYoutubeLink(socialData.youtube);
      setFacebookLink(socialData.facebook);
      setWhatsappLink(socialData.whatsapp);
      setInstagramLink(socialData.instagram);
    }
  }, [socialData]);
  const handleSave = async () => {
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
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <a href={youtubeLink} target="_blank" rel="noreferrer">
            <img src='https://firebasestorage.googleapis.com/v0/b/tismotek-jce-23.appspot.com/o/logos%2Fyoutube.png?alt=media&token=1a5a8159-efb6-4e1e-9ad7-4663387ddc69' alt="YouTube" title="Youtube" />
          </a>
          <a href={facebookLink} target="_blank" rel="noreferrer">
            <img src='https://firebasestorage.googleapis.com/v0/b/tismotek-jce-23.appspot.com/o/logos%2Ffacebook.png?alt=media&token=b2ecff01-a2f5-44c6-9884-449c6ccf700a' alt="Facebook" title="Facebook" />
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <img src='https://firebasestorage.googleapis.com/v0/b/tismotek-jce-23.appspot.com/o/logos%2Fwhatsapp.png?alt=media&token=f7904d1e-345d-4339-b2c9-b6f30e9fa845' alt="WhatsApp" title="Whatsapp" />
          </a>
          <a href={instagramLink} target="_blank" rel="noreferrer">
            <img src='https://firebasestorage.googleapis.com/v0/b/tismotek-jce-23.appspot.com/o/logos%2Finstagram.png?alt=media&token=f753b25f-e44e-4fc7-87df-ebed55ac4ff8' alt="Instagram" title="Instagram" />
          </a>
          {auth.currentUser && (
            <button onClick={handleEdit}>
              {editMode ? 'Editing...' : 'Edit Links'}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Socialnav;
