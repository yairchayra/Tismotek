import React, { useState, useEffect } from 'react';
import { db,auth,storage } from '../firebase';
import { collection, getDocs,doc,updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import YouTube from 'react-youtube';
import './Home.css';

function Home() {
  const [topData, setTopData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [projectsData, setProjectsData] = useState(null);
  const [magazineData, setMagazineData] = useState(null);
  const [youtubeData, setYoutubeData] = useState(null);
  const [homeData, setHomeData] = useState([]);
  const [isEditingTop, setIsEditingTop] = useState(false);
  const [isEditingEvents, setIsEditingEvents] = useState(false);
  const [isEditingProjects, setIsEditingProjects] = useState(false);
  const [isEditingYouTube, setIsEditingYouTube] = useState(false);
  const [isEditingMagazine, setIsEditingMagazine] = useState(false);
  const [editedTopData, setEditedTopData] = useState(null);
  const [editedEventsData, setEditedEventsData] = useState(null);
  const [editedProjectsData, setEditedProjectsData] = useState(null);
  const [editedYouTubeLink, setEditedYouTubeLink] = useState('');
  const [editedMagazineData, setEditedMagazineData] = useState(null);


  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Home'));
      const home = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHomeData(home);
    } catch (error) {
      console.error(`Error fetching Home data:`, error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (homeData.length > 0) {
      setTopData(homeData[3]);
      setEventsData(homeData[0]);
      setProjectsData(homeData[2]);
      setMagazineData(homeData[1]);
      setYoutubeData(homeData[4]);
    }
  }, [homeData]);

  const handleEditTop = () => {
    setIsEditingTop(true);
    setEditedTopData({ ...topData });
  };

  const handleSaveTop = async () => {
    try {
      const topDocRef = doc(db, 'Home', 'top');
      await updateDoc(topDocRef, {
        text: editedTopData.text,
        imageUrl: editedTopData.imageUrl,
      });
      setTopData(editedTopData);
      setIsEditingTop(false);
    } catch (error) {
      console.error('Error updating top data:', error);
    }
  };

  const handleCancelTop = () => {
    setIsEditingTop(false);
  };

  const handleEditEvents = () => {
    setIsEditingEvents(true);
    setEditedEventsData({ ...eventsData });
  };

  const handleSaveEvents = async () => {
    try {
      const eventDocRef = doc(db, 'Home', 'events');
      await updateDoc(eventDocRef, {
        text: editedEventsData.text,
        imageUrl: editedEventsData.imageUrl,
      });
      setEventsData(editedEventsData);
      setIsEditingEvents(false);
    } catch (error) {
      console.error('Error updating events data:', error);
    }
  };

  const handleCancelEvents = () => {
    setIsEditingEvents(false);
  };

  const handleEditProjects = () => {
    setIsEditingProjects(true);
    setEditedProjectsData({ ...projectsData });
  };

  const handleSaveProjects = async () => {
    try {
      const projectsDocRef = doc(db, 'Home', 'projects');
      await updateDoc(projectsDocRef, {
        text: editedProjectsData.text,
        imageUrl: editedProjectsData.imageUrl,
      });
      setProjectsData(editedProjectsData);
      setIsEditingProjects(false);
    } catch (error) {
      console.error('Error updating projects data:', error);
    }
  };

  const handleCancelProjects = () => {
    setIsEditingProjects(false);
  };

  const handleEditYouTube = () => {
    setIsEditingYouTube(true);
    setEditedYouTubeLink({...youtubeData});
  };

  const handleSaveYouTube = async () => {
    try {
      if (!editedYouTubeLink) {
        throw new Error('YouTube link is undefined.');
      }

      const updatedYouTubeData  = {Url:editedYouTubeLink};

      const youTubeDocRef = doc(db, 'Home', 'youtube');
      await updateDoc(youTubeDocRef, updatedYouTubeData);

      setYoutubeData(editedYouTubeLink);
      setIsEditingYouTube(false);
    } catch (error) {
      console.error('Error updating YouTube data:', error);
    }
  };



  const handleCancelYouTube = () => {
    setIsEditingYouTube(false);
  };

  const handleEditMagazine = () => {
    setIsEditingMagazine(true);
    setEditedMagazineData({ ...magazineData });
  };

  const handleSaveMagazine = async () => {
    try {
      const magazineDocRef = doc(db, 'Home', 'magazine');
      await updateDoc(magazineDocRef, {
        text: editedMagazineData.text,
        Url: editedMagazineData.Url,
      });
      setMagazineData(editedMagazineData);
      setIsEditingMagazine(false);
    } catch (error) {
      console.error('Error updating magazine data:', error);
    }
  };

  const handleCancelMagazine = () => {
    setIsEditingMagazine(false);
  };
    const handleImageFileChange = (file, type) => {
        if (file) {
            let newFileName="";
            if(type==='top'){
                newFileName='home_top.png';
            }
            else if(type==='events'){
                newFileName='home_events.png';
            }
            else if(type==='projects'){
                newFileName='home_projects.png';
            }
            else if(type==='magazine'){
                newFileName='מהורה להורה - קטן.pdf';
            }
            const storageRef = ref(storage,`${newFileName}`);
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
                             if(type==='top'){
                                setEditedTopData({ ...editedTopData, imageUrl: url})
                            }
                            else if(type==='events'){
                                setEditedEventsData({ ...editedEventsData, imageUrl: url })
                            }
                            else if(type==='projects'){
                                setEditedProjectsData({ ...editedProjectsData, imageUrl: url })
                            }
                            else{
                                setEditedMagazineData({ ...editedMagazineData, Url: url })
                            }
                        })
                        .catch((error) => {
                            console.log("Error getting download URL:", error);
                        });
                }
            );
        }
    };
    function extractVideoId(url) {
        const match = url.match(/(?:\?v=|\/embed\/|\/\d+\/|\/vi\/|\/v\/|https:\/\/www\.youtube\.com\/watch\?v=)([^#]{11})/);
        return match ? match[1] : null;
        }
  return (
    <div className="container">
      <div className="top-section">
        {isEditingTop ? (
          <div>
            <input className="form-control"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) =>handleImageFileChange(e.target.files[0],'top')}
          />
            <input
              type="text"
              value={editedTopData?.text}
              onChange={(e) =>
                setEditedTopData({ ...editedTopData, text: e.target.value })
              }
            />
            <button onClick={handleSaveTop}>Save</button>
            <button onClick={handleCancelTop}>Cancel</button>
          </div>
        ) : (
          <div>
            <img src={topData?.imageUrl} className="img-fluid" alt="Home" />
            <p>{topData?.text}</p>
            {auth.currentUser && <button onClick={handleEditTop}>Edit</button>}
          </div>
        )}
      </div>
      <div className="events-projects-section">
        <div className="youtube-section">
          {isEditingYouTube ? (
            <div>
              <input
                    type="text"
                    value={editedYouTubeLink}
                    onChange={(e) => setEditedYouTubeLink(e.target.value)}
                />
              <button onClick={handleSaveYouTube}>Save</button>
              <button onClick={handleCancelYouTube}>Cancel</button>
            </div>
          ) : (
            <div className='youtube-edit-container'>
                 <div className='youtube-video-container'>
                                  {youtubeData && youtubeData.Url && (
               <YouTube
               videoId={extractVideoId(youtubeData.Url)}
               opts={{
                width: '100%',
                height: '280',
                playerVars: {
                    origin: 'http://localhost:3000', // Set the origin to your application's URL
                  }
              }}/>
                )}
                </div>
                <div className="edit-container">
              {auth.currentUser && <button  onClick={handleEditYouTube}>Edit</button>}
              </div>
            </div>
          )}
        </div>
        <div className="events-section">
          {isEditingEvents ? (
            <div>
              <input className="form-control"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) =>handleImageFileChange(e.target.files[0],'events')}
            />

              <input
                type="text"
                value={editedEventsData?.text}
                onChange={(e) =>
                  setEditedEventsData({ ...editedEventsData, text: e.target.value })
                }
              />
              <button onClick={handleSaveEvents}>Save</button>
              <button onClick={handleCancelEvents}>Cancel</button>
            </div>
          ) : (
            <div>
              {eventsData && (
                <Link to="/events" className="card">
                  <img className="card-img-top" src={eventsData.imageUrl} alt="Card cap" />
                  <div className="card-body">
                    <p className="card-text">{eventsData.text}</p>
                  </div>
                </Link>
              )}
              {auth.currentUser && <button onClick={handleEditEvents}>Edit</button>}
            </div>
          )}
        </div>
        <div className="projects-section">
          {isEditingProjects ? (
            <div>
              <input className="form-control"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) =>handleImageFileChange(e.target.files[0],'projects')}
            />
              <input
                type="text"
                value={editedProjectsData?.text}
                onChange={(e) =>
                  setEditedProjectsData({ ...editedProjectsData, text: e.target.value })
                }
              />
              <button onClick={handleSaveProjects}>Save</button>
              <button onClick={handleCancelProjects}>Cancel</button>
            </div>
          ) : (
            <div>
              {projectsData && (
                <Link to="/projects" className="card">
                  <img className="card-img-top" src={projectsData.imageUrl} alt="Card cap" />
                  <div className="card-body">
                    <p className="card-text">{projectsData.text}</p>
                  </div>
                </Link>
              )}
              {auth.currentUser && <button onClick={handleEditProjects}>Edit</button>}
            </div>
          )}
        </div>
      </div>
      <div className="button-container">
        {isEditingMagazine ? (
          <div>
            <input
              type="text"
              value={editedMagazineData?.text}
              onChange={(e) =>
                setEditedMagazineData({ ...editedMagazineData, text: e.target.value })
              }
            />
            <input className="form-control"
                type="file"
                accept=".pdf"
                onChange={(e) =>handleImageFileChange(e.target.files[0],'magazine')}
            />
            <button onClick={handleSaveMagazine}>Save</button>
            <button onClick={handleCancelMagazine}>Cancel</button>
          </div>
        ) : (
          <div>
            {magazineData && (
              <button onClick={() => window.open(magazineData.Url, '_blank')}>
                {magazineData.text}
              </button>
            )}
            {auth.currentUser && <button onClick={handleEditMagazine}>Edit</button>}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
