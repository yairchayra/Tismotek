import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './About.css';

const About = () => {
  const [aboutData, setAboutData] = useState({ text: '', imageUrl: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [editedImageUrl, setEditedImageUrl] = useState('');

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const aboutDocRef = doc(db, 'about', 'LRn1319mLuETvoJ3SCWv');
        const docSnapshot = await getDoc(aboutDocRef);

        if (docSnapshot.exists()) {
          setAboutData(docSnapshot.data());
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  const handleEdit = () => {
    if (auth.currentUser) {
      setIsEditing(true);
      setEditedText(aboutData.text);
      setEditedImageUrl(aboutData.imageUrl);
    } else {
      // Handle authentication error or show a login prompt
    }
  };

  const handleSave = async () => {
    try {
      const aboutDocRef = doc(db, 'about', 'LRn1319mLuETvoJ3SCWv');
      await updateDoc(aboutDocRef, {
        text: editedText,
        imageUrl: editedImageUrl,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating about data:', error);
    }
  };
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `about-page/about.png`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress: " + progress.toFixed(2) + "%");
          // Update the progress bar element
          const progressBar = document.getElementById("uploadProgress");
          progressBar.value = progress;

          // Update the percentage display
          const percentageText = document.getElementById("uploadPercentage");
          percentageText.innerText = progress.toFixed(2) + "%";

        },
        (error) => {
          console.log("Error uploading file:", error);
        },
        () => {
          console.log("File uploaded successfully");
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              setEditedImageUrl(aboutData.imageUrl);
            })
            .catch((error) => {
              console.log("Error getting download URL:", error);
            });
        }
      );
    }
  };
  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="about">
      <div className="about__image">
        {isEditing ? (
          <>
            <img src={aboutData.imageUrl} alt="About" />
            <input className="form-control"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageFileChange}
            />
            <span id="uploadPercentage">0%</span>
            <progress id="uploadProgress" value="0" max="100"></progress>
          </>
        ) : (
          <img src={aboutData.imageUrl} alt="About" />
        )}
      </div>
      <div className="about__buttons">
        {isEditing ? (
          <>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          auth.currentUser && <button onClick={handleEdit}>Edit</button>
        )}
      </div>
      <div className="about__text">
        {isEditing ? (
          <textarea className="form-control"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        ) : (
          <>
            <h2>אודות תסמותק</h2>
            {aboutData.text}
          </>
        )}
      </div>

    </div>
  );
};

export default About;
