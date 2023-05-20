import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Import the db variable
import './About.css';

const About = () => {
  const [aboutData, setAboutData] = useState({ text: '', imageUrl: '' });

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
  console.log(aboutData);
  return (
    <div className="about">
        <div className="about__image">
        <img src={aboutData.imageUrl} alt="About" />
      </div>
      <div className="about__text">{aboutData.text}</div>

    </div>
  );
};

export default About;
