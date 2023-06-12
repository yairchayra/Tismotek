import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [participantEmails, setParticipantEmails] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const eventDocs = eventsSnapshot.docs;

        const eventData = eventDocs.map((eventDoc) => {
          return { id: eventDoc.id, ...eventDoc.data() };
        });

        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleButtonClick = async (eventID, participants) => {
    const emails = [];

    try {
      for (const participant of participants) {
        if (participant.email && participant.email !== '') {
          emails.push(participant.email);
        }
      }

      setParticipantEmails(emails);
      setSelectedEvent(eventID);
    } catch (error) {
      console.error('Error fetching participant data:', error);
    }
  };

  const sendEmails = () => {
    // Perform your email sending logic here
    console.log('Participant Emails:', participantEmails);
    console.log('Email Subject:', emailSubject);
    console.log('Email Text:', emailText);
    setSelectedEvent(null);
    setParticipantEmails([]);
  };

  const cancelEmails = () => {
    setSelectedEvent(null);
    setParticipantEmails([]);
    setEmailSubject('');
    setEmailText('');
  };

  return (
    <div>
      <h2>עדכון נרשמים לפעילות במייל</h2>
      <table className="table">
        <thead>
          <tr>
            <th>פעולה</th>
            <th>כותרת הפעילות</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                {selectedEvent === event.id ? (
                  <div>
                    <div className="form-group">

                      <input
                        type="text"
                        id="emailSubject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                       <label htmlFor="emailSubject">נושא המייל</label>
                    </div>
                    <div className="form-group">

                      <textarea
                        id="emailText"
                        value={emailText}
                        onChange={(e) => setEmailText(e.target.value)}
                      ></textarea>
                       <label htmlFor="emailText">מלל ההודעה</label>
                    </div>
                    <button className="btn btn-primary" onClick={sendEmails}>
                      שלח עדכון
                    </button>
                    <button className="btn btn-secondary" onClick={cancelEmails}>
                      בטל
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleButtonClick(event.id, event.participants)}
                  >
                    ערוך עדכון
                  </button>
                )}
              </td>
              <td>{event.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;
