import React, { useState } from 'react';
import { auth } from '../firebase';
import './Socialnav.css';

function Socialnav() {
  const [editMode, setEditMode] = useState(false);
  const [youtubeLink, setYoutubeLink] = useState('https://www.youtube.com/@user-jn8uy1hw2w');
  const [facebookLink, setFacebookLink] = useState('https://www.facebook.com/tismotek.co.il/?locale=he_IL');
  const [whatsappLink, setWhatsappLink] = useState('https://chat.whatsapp.com/E4KoEm1r6Hy90x0CQUFXSa');

  const logos = require.context('../logos', true);

  const handleSave = () => {
    setEditMode(false);
    // Save the updated links to the backend or perform any other necessary actions
  };

  const handleCancel = () => {
    setEditMode(false);
    // Reset the links to their original values
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
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <a href={youtubeLink} target="_blank" rel="noreferrer">
            <img src={logos('./youtube.png')} alt="YouTube" title="Youtube" />
          </a>
          <a href={facebookLink} target="_blank" rel="noreferrer">
            <img src={logos('./facebook.png')} alt="Facebook" title="Facebook" />
          </a>
          <a href={whatsappLink} target="_blank" rel="noreferrer">
            <img src={logos('./whatsapp.png')} alt="WhatsApp" title="Whatsapp" />
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
