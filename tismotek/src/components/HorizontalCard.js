import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { db, auth, storage } from '../firebase';
import './HorizontalCard.css';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const HorizontalCard = () => {
    const [cardData, setCardData] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editedData, setEditedData] = useState(null);

    useEffect(() => {
        const fetchCardData = async () => {
            try {
                const letterDocRef = doc(db, 'Home', 'personalLetter');
                const docSnapshot = await getDoc(letterDocRef);

                if (docSnapshot.exists()) {
                    setCardData(docSnapshot.data());
                }
            } catch (error) {
                console.error('Error fetching card data:', error);
            }
        };

        fetchCardData();
    }, []);

    const handleExpand = () => {
        setExpanded(true);
    };

    const handleCancelExpand = () => {
        setExpanded(false);
    };

    const handleEdit = () => {
        setEditing(true);
        setEditedData({ ...cardData });
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditedData(null);
    };

    const handleSave = async () => {
        try {
            const letterDocRef = doc(db, 'Home', 'personalLetter');
            await updateDoc(letterDocRef, editedData);
            setCardData(editedData);
            setEditing(false);
        } catch (error) {
            console.error('Error updating card data:', error);
        }
    };

    const handleInputChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleImageFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const storageRef = ref(storage, `home-page/personalLetter.png`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload progress: " + progress.toFixed(2) + "%");

                    // Update the progress bar element
                    const progressBar = document.getElementById("uploadProgress");
                    progressBar.value = progress;

                    // Update the percentage display
                    const percentageText = document.getElementById("uploadPercentage");
                    percentageText.innerText = progress.toFixed(2) + "%";

                },
                (error) => {
                    console.log("Error uploading file:", error);
                },
                () => {
                    console.log("File uploaded successfully");
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            setEditedData({ ...editedData, imageUrl: url });
                        })
                        .catch((error) => {
                            console.log("Error getting download URL:", error);
                        });
                }
            );
        }
    };

    if (!cardData) {
        return <div>Loading...</div>; // Render a loading state while fetching data
    }

    const { title, subtitle, text, imageUrl } = editing ? editedData : cardData;
    const currentUser = auth.currentUser;

    return (
        <Card className="horizontal-card">
            <div className="horizontal-card-image">
                <Card.Img src={imageUrl} alt={title} />
                {editing && (
                    <div className="image-upload">
                        <input className="form-control" type="file" accept="image/png, image/jpeg" onChange={handleImageFileChange} />
                        <span id="uploadPercentage">0%</span>
                        <progress id="uploadProgress" value="0" max="100"></progress>
                    </div>
                )}
            </div>
            <div className="horizontal-card-body">
                {editing && currentUser ? (
                    <div className="edit-fields">
                        <textarea name="title" value={editedData.title} onChange={handleInputChange} />
                        <textarea name="subtitle" value={editedData.subtitle} onChange={handleInputChange} />
                        <textarea name="text" value={editedData.text} onChange={handleInputChange} />
                    </div>
                ) : (
                    <>
                        <Card.Title>{title}</Card.Title>
                        <Card.Text className={expanded ? 'expanded' : ''}>
                            {expanded ? text : text.slice(0, text.length / 2)}
                        </Card.Text>
                        <Card.Subtitle className={expanded ? 'expanded' : ''}>{expanded ? subtitle : ''}</Card.Subtitle>
                        {!expanded && (
                                <div className='toExpand'>
                                    <Button variant="link" onClick={handleExpand}>
                                        להמשך המכתב לחץ כאן
                                    </Button>
                                </div>
                            )}
                    </>
                )}
                {editing && currentUser ? (
                    <>
                        <Button variant="success" onClick={handleSave}>
                            שמור
                        </Button>
                        <Button variant="secondary" onClick={handleCancelEdit}>
                            ביטול
                        </Button>
                    </>
                ) : (
                    <>
                        {currentUser && (
                            <Button variant="secondary" onClick={handleEdit}>
                                ערוך
                            </Button>
                        )}
                        {expanded && (
                            <Button variant="secondary" onClick={handleCancelExpand}>
                                סגור
                            </Button>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
};

export default HorizontalCard;
