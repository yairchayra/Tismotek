import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc,arrayUnion } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './SignUpForm.css'



function SignUpForm({ selectedEvent }) {
  const { eventId } = useParams();
  const [submittedName, setSubmittedName] = useState('');
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const eventRef = doc(db, 'events', eventId);
    const unsubscribe = onSnapshot(eventRef, (snapshot) => {
      setEventData(snapshot.data());
    });

    return () => {
      unsubscribe();
    };
  }, [eventId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form input values
    const fullName = event.target.fullName.value;
    const phoneNumber = event.target.phoneNumber.value;
    const address = event.target.address.value;
    const email = event.target.email.value;
    const numberOfParticipants = parseInt(event.target.numberOfParticipants.value, 10);

    // Check if the form numberOfParticipants exceeds the maximum
    if (numberOfParticipants +eventData.nop> eventData.mnop) {
      alert('Number of participants exceeds the maximum limit.');
      return;
    }

    const participantData = {
      fullName,
      phoneNumber,
      address,
      email,
      numberOfParticipants,
    };

    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      participants: arrayUnion(participantData),
      nop: eventData.nop + numberOfParticipants, // Update the nop by adding the number of participants
    });

    setSubmittedName(fullName); // Store the submitted name
  };

  return (
    <div className='afterSignUp'>
      <h2>טופס הרשמה</h2>
      {submittedName && (
        <div>
          !{submittedName},תודה רבה על הרשמתך
          <br />
         .מחכים לראותכם בפעילות
        </div>
      )}
      {!submittedName && eventData && (
        <form onSubmit={handleSubmit} className="form-control">
          <div>

            <input type="text" name="fullName" required />
            <label>:שם מלא</label>
          </div>
          <div>

            <input type="tel" name="phoneNumber" required />
            <label>:מספר טלפון</label>
          </div>
          <div>

            <input type="text" name="address" required />
            <label>:כתובת</label>
          </div>
          <div>

            <input type="email" name="email"  />
            <label>:כתובת אימייל</label>
          </div>
          <div>

            <input type="number" name="numberOfParticipants"  min={1} required  />
            <label>:מספר משתתפים</label>
          </div>
          <button  type="submit">הגש</button>
        </form>
      )}
    </div>
  );
}

export default SignUpForm;
