import './LogoEdit.css';
import { useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore';

function LogoEdit() {

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const shouldUpload = window.confirm('האם אתה בטוח שברצונך להעלות את הקובץ?');
      if (!shouldUpload) {
        return;
      }

      const storageRef = ref(storage, 'logos/logo.png');
      const uploadTask = uploadBytesResumable(storageRef, file);

      setUploading(true);
      setUploadProgress(0);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress: ' + progress.toFixed(2) + '%');
          setUploadProgress(progress);
        },
        (error) => {
          console.log('Error uploading file:', error);
        },
        () => {
          console.log('File uploaded successfully');
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              updateLogoMainUrl(url);
              setUploading(false);
              setUploadProgress(0);
            })
            .catch((error) => {
              console.log('Error getting download URL:', error);
              setUploading(false);
              setUploadProgress(0);
            });
        }
      );
    }
  };

  const updateLogoMainUrl = async (url) => {
    try {
      const docRef = doc(db, 'logos', 'links');
      await updateDoc(docRef, { mainUrl: url });
      console.log('Logo mainUrl updated successfully!');
    } catch (error) {
      console.log('Error updating logo mainUrl:', error);
    }
  };

  return (
    <div className="LogoEdit">
      <button  className="btn btn-info" type="button" onClick={() => document.getElementById('logoInput').click()}>
        החלף לוגו
      </button>
      <input id="logoInput" type="file" accept="image/png, image/jpeg" onChange={handleImageFileChange} style={{ display: 'none' }} />
      {uploading && (
        <div>
          <progress value={uploadProgress} max="100"></progress>
          <div>{uploadProgress.toFixed(2)}%</div>
        </div>
      )}
    </div>
  );
}

export default LogoEdit;
