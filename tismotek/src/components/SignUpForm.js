import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc,arrayUnion } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './SignUpForm.css'



function SignUpForm({ selectedEvent }) {
  const { eventId } = useParams();
  const [submittedName, setSubmittedName] = useState('');
  const [eventData, setEventData] = useState(null);
  const [validationError, setValidationError] = useState('');


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

    // Validate phone number format
    const phoneRegex = /^05[0-9]\d{7}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setValidationError('מספר טלפון לא תקין אנא נסה שנית');
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
    <div className='signup-container'>
    <div className='afterSignUp'>
      <h2 className='signup-header'>טופס הרשמה</h2>
      {submittedName && (
        <div className='signup-message'>
          !{submittedName},תודה רבה על הרשמתך
          <br />
         .מחכים לראותך בפעילות
        </div>
      )}
      {!submittedName && eventData && (
        <form onSubmit={handleSubmit} className="form-control">
          <span >שדה חובה</span>
          <span className="required-indicator">*</span>
          <div className="blank-row"></div>
          <div className="form-group">
          <label>:שם מלא<span className="required-indicator">*</span></label>
            <input  className="form-control" type="text" name="fullName" required />
          </div>
          <div className="form-group" >
          <label>:מספר טלפון<span className="required-indicator">*</span></label>
            <input  className="form-control" type="tel" name="phoneNumber" required />

          </div>
          <div className="form-group">
          <label>:כתובת<span className="required-indicator">*</span></label>
            <input  className="form-control" type="text" name="address" required />

          </div>
          <div className="form-group">
          <label>:כתובת אימייל</label>
            <input  className="form-control" type="email" name="email" placeholder="name@example.com"  />
            <small id="emailHelp" class="form-text text-muted">נשמח לקבל את כתובת האימייל בכדי לעדכן במידה ויהיו שינויים בפעילות</small>
          </div>
          <div>
          <label>:מספר משתתפים<span className="required-indicator">*</span></label>
            <input  className="form-control" type="number" name="numberOfParticipants"  min={1} required  />

          </div>
           {/* Phone number validation error */}
           {validationError && (
            <div className="error">{validationError}</div>
          )}
          <div id='submit-signup'>
          <button  className="btn btn-primary"  type="submit">הגש</button>
          </div>
        </form>
      )}
    </div>
    </div>
  );
}

export default SignUpForm;
