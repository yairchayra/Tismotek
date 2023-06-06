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
    try {
      const docRef = doc(db, 'donation', 'link');
      await updateDoc(docRef, { url });
      setIsEditing(false);
      console.log('Donation link updated successfully!');
    } catch (error) {
      console.log('Error updating donation link:', error);
    }
  };

  return (
    <div className="DonationEdit">
      {!isEditing ? (
        <button onClick={handleEdit}>Edit Donation Link</button>
      ) : (
        <>
          <input
          className='form-control'
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter the new donation link"
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      )}
    </div>
  );
}

export default DonationEdit;
