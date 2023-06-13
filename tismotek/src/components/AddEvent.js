import React, { useState,useEffect } from 'react';
import { doc, setDoc,collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './AddEvent.css'


function AddEvent() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [mnop, setMnop] = useState(0);
    const [missingNumber, setMissingNumber] = useState(null);
    const [eventData, setEventData] = useState([]);

    const navigate = useNavigate();
    const fetchEventsData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'events'));
            const Events = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Map the last character of each document ID to a number and save it in the array
            const lastCharsAsNumbers = Events.map((event) => parseInt(event.id.slice(-1), 10));
            for (let i = 0; i < lastCharsAsNumbers.length - 1; i++) {
                const diff = lastCharsAsNumbers[i + 1] - lastCharsAsNumbers[i];
                if (diff > 1) {
                    setMissingNumber(lastCharsAsNumbers[i] + 1);
                    break;
                }
                if (i === lastCharsAsNumbers.length - 2) {
                    setMissingNumber(null);
                }
            }
            setEventData(Events);
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    useEffect(() => {
        fetchEventsData();
    }, []);
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            const fileExtension = file.name.split('.').pop();
            let eventId="";
            if(missingNumber){
                eventId=`event${missingNumber}`;
            }
            else{
                eventId=`event${eventData.length+1}`
            }
            const fileName = `${eventId}.${fileExtension}`;
            const storageRef = ref(storage, `events-page/${eventId}/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

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
                            // Handle saving event data with the file URL
                            saveEventData(url);
                        })
                        .catch((error) => {
                            console.log('Error getting download URL:', error);
                        });
                }
            );
        } else {
            // Handle saving event data without a file URL
            saveEventData('');
        }
    };

    const saveEventData = async (fileUrl) => {
        try {
            const event = {
                title,
                location,
                date,
                description,
                nop: 0,
                mnop: parseInt(mnop, 10),
                participants: [],
                fileUrl,
            };
            let eventId="";
            if(missingNumber){
                eventId=`event${missingNumber}`;
            }
            else{
                eventId=`event${eventData.length+1}`
            }
            const eventRef = doc(db, 'events',eventId);
            await setDoc(eventRef, event);

            navigate('/events');
        } catch (error) {
            console.error('Error saving event data:', error);
        }
    };

    return (
        <div className='addevent-container'>
            <div className='addevent-form'>
            <h1>הוסף פעילות</h1>
            <form className='form-control'>
            <span >שדה חובה</span>
          <span className="required-indicator">*</span>
          <div className="blank-row"></div>
          <div className="row">

                <div className="col">
                <label>:מיקום</label>
                    <input  className="form-control" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

                </div>
                <div className="col">
                <label>:כותרת <span className="required-indicator">*</span></label>
                    <input required className="form-control" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />

                </div>
                </div>
                <div className="row">
                <div className="col">
                <label>:תאריך <span className="required-indicator">*</span></label>
                    <input required className="form-control" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />

                </div>
                <div className="col">
                <label>:תיאור</label>
                    <textarea  className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />

                </div>
                </div>
                <div className="row">
                <div className="col">
                <label>:מספר משתתפים מרבי <span className="required-indicator">*</span></label>
                    <input required className="form-control" type="number" min={0} value={mnop} onChange={(e) => setMnop(e.target.value)} />
                    <small id="mnopHelp" className="form-text text-muted">גם אם אין מגבלה על כמות הנרשמים נא לבחור מספר גבוה,אם תרצו להוסיף פעילות אך לא להתחיל הרשמה בחרו 0 ותשנו בהמשך </small>


                </div>
                <div className="col">
                <label>:קובץ</label>
                    <input className="form-control"  type="file" onChange={handleFileChange} />

                    {uploadProgress > 0 && <p>Upload progress: {uploadProgress.toFixed(2)}%</p>}
                </div>
                </div>
                <div id="submit-addevent">
                    <button  className="btn btn-primary" type="button" onClick={handleUpload}>
                        צור פעילות
                    </button>
                </div>

            </form>
        </div>
        </div>
    );
}

export default AddEvent;
