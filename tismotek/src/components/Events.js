import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import SignUpForm from './SignUpForm';
import { useNavigate } from 'react-router-dom';

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
  const handleDelete = async (event) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this project?');
    if (shouldDelete) {
      try {
        const storageRef = ref(storage, event.fileUrl);
        await deleteObject(storageRef);
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
    <div>
      <h1>Events</h1>
      {auth.currentUser && (
        <div>
          <button onClick={handleAddEvent}>Add Event</button>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Actions</th>
            <th>File</th>
            <th>Description</th>
            <th>Date</th>
            <th>Location</th>
            <th>Title</th>
            {auth.currentUser && <th>Max Participants</th>}
            {auth.currentUser && <th>Number of Participants</th>}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>
                {editingEvent && editingEvent.id === event.id ? (
                  // Edit mode
                  <div>
                    <button className="btn btn-primary" onClick={handleSave}>
                      Save
                    </button>
                    <button className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  // Display mode
                  <div>
                    {auth.currentUser ? (
                      <>
                        <button className="btn btn-primary" onClick={() => handleEdit(event)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDelete(event)}>
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleSignUp(event)}
                        disabled={event.nop === event.mnop}
                      >
                        {event.nop === event.mnop ? 'Full Booked' : 'Sign Up'}
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
                        Uploading: ({uploadProgress.toFixed(2)}%)
                      </div>
                    )}
                    <button className="btn btn-primary" onClick={handleUpload}>
                      Upload
                    </button>
                  </div>
                ) : (
                  <>
                    {event.fileUrl ? (
                      <a href={event.fileUrl} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    ) : (
                      <span>No file uploaded</span>
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
