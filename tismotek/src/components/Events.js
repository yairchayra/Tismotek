import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpForm from './SignUpForm';
import { useNavigate } from 'react-router-dom';
import './Events.css'

function Events() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const fetchedEvents = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, id: doc.id };
        });
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events data:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEdit = (event) => {
    setEditingEvent(event);
  };

  const handleSave = async () => {
    try {
      if (parseInt(editingEvent.mnop, 10) < editingEvent.nop) {
        alert("מספר המשתמשים המקסימלי קטן ממספר המשתמשים הרשומים");
        return;
      }
      const eventRef = doc(db, 'events', editingEvent.id);
      await updateDoc(eventRef, {
        title: editingEvent.title,
        location: editingEvent.location,
        date: editingEvent.date,
        description: editingEvent.description,
        mnop: parseInt(editingEvent.mnop, 10),
        fileUrl: editingEvent.fileUrl,
      });
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event data:', error);
    }
  };

  const handleCancel = () => {
    setEditingEvent(null);
  };

  const handleInputChange = (event, fieldName) => {
    const { value } = event.target;
    setEditingEvent((prevEvent) => ({
      ...prevEvent,
      [fieldName]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const eventId = editingEvent.id;
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${eventId}.${fileExtension}`;
      const storageRef = ref(storage, `events-page/${eventId}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

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
              const updatedEvent = { ...editingEvent, fileUrl: url };
              setEditingEvent(updatedEvent);
              setSelectedFile(null);
              setUploadProgress(0);
            })
            .catch((error) => {
              console.log('Error getting download URL:', error);
            });
        }
      );
    }
  };
  const handleFileDelete=async(event)=>{
    const shouldDelete = window.confirm('אתה בטוח שתרצה למחוק את הקובץ?');
    if (shouldDelete) {
      try {
        const storageRef = ref(storage, event.fileUrl);
         await deleteObject(storageRef);
         const updatedEvent = { ...editingEvent, fileUrl: '' };
         setEditingEvent(updatedEvent);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleDelete = async (event) => {
    const shouldDelete = window.confirm('אתה בטוח שתרצה למחוק את הפעילות?');
    if (shouldDelete) {
      try {
        if (event.excelUrl && event.excelUrl !== '') {
          const storageRef = ref(storage, event.excelUrl);
          await deleteObject(storageRef);
        }
        if (event.fileUrl && event.fileUrl !== '') {
          const storageRef = ref(storage, event.fileUrl);
          await deleteObject(storageRef);
        }
        const eventRef = doc(db, 'events', event.id);
        await deleteDoc(eventRef);
        // Remove the deleted event from the state
        setEvents((prevEvents) => prevEvents.filter((evt) => evt.id !== event.id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };
  const navigate = useNavigate();

  const handleSignUp = (event) => {
    setSelectedEvent(event);
    navigate(`/events/signup/${event.id}`);
  };
  const handleAddEvent = () => {
    navigate('/events/add');
  };
  return (
    <div className='events-container'>
      <h1>פעילויות</h1>
      {auth.currentUser && (
        <div>
          <button id='addeventbutton' className="btn btn-success" onClick={handleAddEvent}>הוסף פעילות</button>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>פעולות</th>
            <th>קובץ מצורף</th>
            <th>תיאור</th>
            <th>תאריך ושעה</th>
            <th>מיקום</th>
            <th>כותרת</th>
            {auth.currentUser && <th>מספר משתתפים מקסימלי</th>}
            {auth.currentUser && <th>מספר משתתפים רשומים</th>}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                {editingEvent && editingEvent.id === event.id ? (
                  // Edit mode
                  <div>
                    <button className="btn btn-success" onClick={handleSave}>
                      שמור
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      בטל
                    </button>
                  </div>
                ) : (
                  // Display mode
                  <div>
                    {auth.currentUser ? (
                      <>
                        <button className="btn btn-primary" onClick={() => handleEdit(event)}>
                          ערוך פעילות
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(event)}>
                          מחק פעילות
                        </button>
                      </>
                    ) : (
                      <button id='SignUp-Button'
                        className="btn btn-primary"
                        onClick={() => handleSignUp(event)}
                        disabled={event.nop === event.mnop}
                      >
                        {event.nop === event.mnop ? 'פעילות מלאה' : 'להרשמה'}
                      </button>
                    )}
                  </div>
                )}
              </td>
              <td>
                {editingEvent && editingEvent.id === event.id ? (
                  <div>
                    <input type="file" onChange={handleFileChange} />
                    {selectedFile && (
                      <div>
                        מעלה: ({uploadProgress.toFixed(2)}%)
                      </div>
                    )}
                    <button className="btn btn-primary" onClick={handleUpload}>
                      עלה קובץ
                    </button>
                    {event.fileUrl && event.fileUrl !== ''&&
                    <button className="btn btn-danger" onClick={() =>handleFileDelete(event)}>
                      מחק קובץ
                    </button>
                    }
                  </div>
                ) : (
                  <>
                    {event.fileUrl ? (
                      <a href={event.fileUrl} target="_blank" rel="noopener noreferrer">
                        פתח קובץ
                      </a>
                    ) : (
                      <span> </span>
                    )}
                  </>
                )}
              </td>
              <td>
                {editingEvent && editingEvent.id === event.id ? (
                  <input
                    type="text"
                    value={editingEvent.description}
                    onChange={(e) => handleInputChange(e, 'description')}
                  />
                ) : (
                  event.description
                )}
              </td>
              <td>
                {editingEvent && editingEvent.id === event.id ? (
                  <input
                    type="datetime-local"
                    value={editingEvent.date}
                    onChange={(e) => handleInputChange(e, 'date')}
                  />
                ) : (
                  new Date(event.date).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                )}
              </td>
              <td>
                {editingEvent && editingEvent.id === event.id ? (
                  <input
                    type="text"
                    value={editingEvent.location}
                    onChange={(e) => handleInputChange(e, 'location')}
                  />
                ) : (
                  event.location
                )}
              </td>
              <td>
                {editingEvent && editingEvent.id === event.id ? (
                  <input
                    type="text"
                    value={editingEvent.title}
                    onChange={(e) => handleInputChange(e, 'title')}
                  />
                ) : (
                  event.title
                )}
              </td>
              {auth.currentUser && (
                <>
                  <td>
                    {editingEvent && editingEvent.id === event.id ? (
                      <input
                        type="number"
                        value={editingEvent.mnop}
                        min={0}
                        onChange={(e) => handleInputChange(e, 'mnop')}
                      />
                    ) : (
                      event.mnop
                    )}
                  </td>
                  <td>{event.nop}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEvent && <SignUpForm selectedEvent={selectedEvent} />}
    </div>
  );
}

export default Events;
