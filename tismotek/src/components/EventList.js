import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import "./EventList.css"

emailjs.init('c0xAxLDDn7xvb73Qn');

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

    const sendEmail = () => {
        const serviceID = 'ofriab';
        const templateID = 'template_rg58kxv';
        console.log(participantEmails);
        participantEmails.forEach((participant) => {
            // Prepare the email content and variables
            const templateParams = {
                to_email: participant,
                subject: emailSubject,
                message: emailText,
            };
            // Use EmailJS to send the email
            emailjs.send(serviceID, templateID, templateParams)
                .then((response) => {
                    setSelectedEvent(null);
                    setParticipantEmails([]);
                    console.log(response);

                })
                .catch((error) => {
                    console.error('Email sending error:', error);
                });

        });
        alert('הודעתך נשלחה בהצלחה');
    };

    const cancelEmails = () => {
        setSelectedEvent(null);
        setParticipantEmails([]);
        setEmailSubject('');
        setEmailText('');
    };

    return (
        <div className='eventList-container'>
            <h2>עדכון נרשמים לפעילות במייל</h2>
            <table  className="table table-striped">
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
                                        <label htmlFor="emailSubject">נושא המייל</label>
                                            <input
                                            className='form-control'
                                                type="text"
                                                id="emailSubject"
                                                value={emailSubject}
                                                onChange={(e) => setEmailSubject(e.target.value)}
                                            />

                                        </div>
                                        <div className="form-group">
                                        <label htmlFor="emailText">מלל ההודעה</label>
                                            <textarea
                                            className='form-control'
                                                id="emailText"
                                                value={emailText}
                                                onChange={(e) => setEmailText(e.target.value)}
                                            ></textarea>

                                        </div>

                                        <button className="btn btn-secondary" onClick={cancelEmails}>
                                            בטל
                                        </button>
                                        <button className="btn btn-success" onClick={sendEmail}>
                                            שלח
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleButtonClick(event.id, event.participants)}
                                    >
                                        שליחת עדכון
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
