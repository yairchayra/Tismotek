import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Projects.css';
import { db, auth, storage } from '../firebase';
import { collection, getDocs, updateDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";


function Projects() {
    const [projectData, setProjectData] = useState([]);
    const [editedData, setEditedData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isNewProject, setIsNewProject] = useState(false); // Added state for new project
    const [newProjectData, setNewProjectData] = useState({}); // Added state for new project
    const [missingNumber, setMissingNumber] = useState(null);

      // Fetch project data from Firestore
    const fetchProjectData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            const projects = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            projects.forEach((project) => {
                console.log(project.id);
            });
            // Map the last character of each document ID to a number and save it in the array
            const lastCharsAsNumbers = projects.map((project) => parseInt(project.id.slice(-1), 10));
            for (let i = 0; i < lastCharsAsNumbers.length - 1; i++) {
                const diff = lastCharsAsNumbers[i + 1] - lastCharsAsNumbers[i];
                if (diff > 1) {
                  setMissingNumber(lastCharsAsNumbers[i] + 1);
                  break;
                }
                if(i===lastCharsAsNumbers.length - 2){
                    setMissingNumber(null);
                }
              }
            console.log(lastCharsAsNumbers);
            setProjectData(projects);
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };

    useEffect(() => {
            fetchProjectData();
    }, []);

    const handleEdit = async (projectId, updatedData) => {
        try {
            console.log(updatedData);
            await updateDoc(doc(db, 'projects', projectId), updatedData);
            console.log('Project updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedData({});
    };

    const handleSave = async (projectId) => {
        if (isNewProject) {
            try {
                const projectId = missingNumber !== null ? `project${missingNumber}` : `project${projectData.length + 1}`;
                const newProjectRef = doc(db, 'projects', projectId);
                await setDoc(newProjectRef, newProjectData);
                console.log('New project added successfully with ID:', newProjectRef.id);
                setIsNewProject(false);
                fetchProjectData();
            } catch (error) {
                console.error('Error adding new project:', error);
            }
        } else {
            handleEdit(projectId, editedData);
        }
        setEditedData({});
        setNewProjectData({});
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (isNewProject) {
            setNewProjectData((prevData) => ({ ...prevData, [name]: value }));
        } else {
            setEditedData((prevData) => ({ ...prevData, [name]: value }));
        }
    };
    const handleImageFileChange = (file, projectId) => {
        if (file) {
            const storageRef = ref(storage, `project${projectId}.png`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload progress: " + progress.toFixed(2) + "%");
                },
                (error) => {
                    console.log("Error uploading file:", error);
                },
                () => {
                    console.log("File uploaded successfully");
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((url) => {
                            if (isNewProject) {
                                setNewProjectData((prevData) => ({
                                    ...prevData,
                                    imageUrl: url
                                }));
                            } else {
                                setEditedData((prevData) => ({
                                    ...prevData,
                                    imageUrl: url
                                }));
                            }
                        })
                        .catch((error) => {
                            console.log("Error getting download URL:", error);
                        });
                }
            );
        }
    };
    const handleDelete = async (projectId, imageUrl) => {
        try {
            // Delete image from storage
            const storageRef = ref(storage, imageUrl);
            await deleteObject(storageRef);

            // Delete document from Firestore
            await deleteDoc(doc(db, 'projects', projectId));
            console.log('Project and image deleted successfully!');
            fetchProjectData();
        } catch (error) {
            console.error('Error deleting project and image:', error);
        }
    };

    return (
        <div className="projects">
            <Carousel interval={auth.currentUser ? null : 9000}>
                {projectData.map((project, index) => (
                    <Carousel.Item key={index}>
                        <img className="d-block w-100" src={project.imageUrl} alt={`Slide ${index + 1}`} />
                        <div className="project-caption">
                            {auth.currentUser && (
                                <>
                                    <h3>
                                        {isEditing ? (
                                            <input class="form-control"
                                                type="text"
                                                name="header"
                                                value={editedData.header || project.header}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            project.header
                                        )}
                                    </h3>
                                    <p>
                                        {isEditing ? (
                                            <textarea class="form-control"
                                                name="text"
                                                value={editedData.text || project.text}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            project.text
                                        )}
                                    </p>
                                    {isEditing ? (
                                        <div>
                                            <input class="form-control"
                                                type="file"
                                                accept="image/png, image/jpeg"
                                                onChange={(e) => handleImageFileChange(e.target.files[0], projectData.length + 1)}
                                            />
                                            <button onClick={() => handleSave(project.id)}>Save</button>
                                            <button onClick={handleCancel}>Cancel</button>
                                        </div>
                                    ) : (
                                        <>
                                            <button  onClick={() => setIsEditing(true)}>Edit</button>
                                            {'    '}

                                            <button onClick={() => handleDelete(project.id, project.imageUrl)}>Delete</button> {/* Add delete button */}
                                        </>
                                    )}
                                </>
                            )}
                            {!auth.currentUser && (
                                <>
                                    <h3>{project.header}</h3>
                                    <p>{project.text}</p>
                                </>
                            )}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
            {auth.currentUser && (
                <>
                    {isEditing || isNewProject ? null : (
                        <button onClick={() => setIsNewProject(true)}>New Project</button>
                    )}
                    {isNewProject && (
                        <>
                            <input class="form-control"
                                type="text"
                                name="header"
                                placeholder="Header"
                                value={newProjectData.header || ''}
                                onChange={handleInputChange}
                            />
                            <textarea class="form-control"  rows="3"
                                name="text"
                                placeholder="Text"
                                value={newProjectData.text || ''}
                                onChange={handleInputChange}
                            />
                            <input class="form-control"
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={(e) => {
                                    if (missingNumber !== null) {
                                        handleImageFileChange(e.target.files[0], missingNumber);
                                    } else {
                                      handleImageFileChange(e.target.files[0], projectData.length + 1);
                                    }
                                  }}
                            />
                            <button onClick={() => handleSave()}>Save New Project</button>
                            <button onClick={() => setIsNewProject(false)}>Cancel</button>
                        </>
                    )}
                </>

            )}
        </div>
    );
}

export default Projects;
