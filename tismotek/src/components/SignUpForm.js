import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc,arrayUnion } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div>
      <h2>Sign Up Form</h2>
      {submittedName && (
        <div>
          Thank you for signing up, {submittedName}!
          <br />
          You have successfully registered for the event.
        </div>
      )}
      {!submittedName && eventData && (
        <form onSubmit={handleSubmit} className="form-control">
          <div>
            <label>Full Name:</label>
            <input type="text" name="fullName" required />
          </div>
          <div>
            <label>Phone Number:</label>
            <input type="tel" name="phoneNumber" required />
          </div>
          <div>
            <label>Address:</label>
            <input type="text" name="address" required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" required />
          </div>
          <div>
            <label>Number of Participants:</label>
            <input type="number" name="numberOfParticipants"  min={1} required  />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default SignUpForm;
