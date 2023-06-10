import './DonationEdit.css';
import { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

function DonationEdit() {
  const [url, setUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setUrl(''); // Reset the input field
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!url.trim()) {
      setIsEditing(false);
      return;
    }

    const shouldUpdate = window.confirm('האם אתה בטוח שתרצה לשנות את הקישור לאתר התרומות?');
    if (shouldUpdate) {
      try {
        const docRef = doc(db, 'donation', 'link');
        await updateDoc(docRef, { url });
        setIsEditing(false);
        console.log('Donation link updated successfully!');
      } catch (error) {
        console.log('Error updating donation link:', error);
      }
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="DonationEdit">
      {!isEditing ? (
        <button  type="button" className="btn" style={{ backgroundColor: '#1E3A8A', color: '#fff' }} onClick={handleEdit}>
          ערוך קישור לאתר התרומות
        </button>
      ) : (
        <>
          <input
            className="form-control"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="הכנס קישור חדש לאתר התרומות"
          />
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            שמור
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            בטל
          </button>
        </>
      )}
    </div>
  );
}

export default DonationEdit;
