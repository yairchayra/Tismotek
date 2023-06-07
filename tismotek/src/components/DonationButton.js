import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import './DonationButton.css'


function DonationButton() {
  const [donationLink, setDonationLink] = useState('');

  useEffect(() => {
    fetchDonationLink();
  }, []);

  const fetchDonationLink = async () => {
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

  return (

    <button id='donation-b' type="button" className="btn btn-success btn-lg">
      <a  className="text-decoration-none"href={donationLink} target="_blank" rel="noopener noreferrer">לתרומה      </a>
    </button>

  );
}

export default DonationButton;
