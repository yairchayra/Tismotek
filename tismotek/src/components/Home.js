import React, { useState, useEffect } from 'react';
import { db,auth,storage } from '../firebase';
import { collection, getDocs,doc,updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import YouTube from 'react-youtube';
import './Home.css';
import  HorizontalCard from './HorizontalCard'
import Articles from './Articles';

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
  const [isLoading, setIsLoading] = useState(true); // Add loading state variable



  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Home'));
      const home = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHomeData(home);
      setIsLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error(`Error fetching Home data:`, error);
      setIsLoading(false); // Set loading to false in case of error

    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (homeData.length > 0) {
      homeData.forEach((item) => {
        switch (item.id) {
          case 'top':
            setTopData(item);
            break;
          case 'events':
            setEventsData(item);
            break;
          case 'projects':
            setProjectsData(item);
            break;
          case 'magazine':
            setMagazineData(item);
            break;
          case 'youtube':
            setYoutubeData(item);
            break;
          default:
            break;
        }
      });
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
            const storageRef = ref(storage,`home-page/${newFileName}`);
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
    <div className="home-container">
      {isLoading ? ( // Render loading div when isLoading is true
        <div>...טוען</div>
      ) : (
        // Render the rest of the components when isLoading is false
        <>
      <div className="top-section" >
        {isEditingTop ? (
          <div>
            <input className="form-control"
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) =>handleImageFileChange(e.target.files[0],'top')}
          />
           <span id="uploadPercentage">0%</span>
                        <progress id="uploadProgress" value="0" max="100"></progress>
            <input
              type="text"
              className="form-control"
              value={editedTopData?.text}
              onChange={(e) =>
                setEditedTopData({ ...editedTopData, text: e.target.value })
              }
            />
            <button type="button" className="btn btn-success" onClick={handleSaveTop}>שמור</button>
            <button  type="button" className="btn btn-secondary" onClick={handleCancelTop}>בטל</button>
          </div>
        ) : (
          <div className='text-img-top' >
            <img  src={topData?.imageUrl} alt='top '></img>
          <div className='top-section-text'>
          <h5>
            {topData?.text}
          </h5>
          </div>
          <div className='top-section-button'>
          {auth.currentUser && <button  type="button" className="btn btn-secondary" onClick={handleEditTop}>ערוך</button>}
          </div>
        </div>
        )}
      </div>
      <div className="events-projects-section">
        <div className="youtube-section">
          {isEditingYouTube ? (
            <div>
              <input
                    type="text"
                    className="form-control"
                    value={editedYouTubeLink}
                    onChange={(e) => setEditedYouTubeLink(e.target.value)}
                />
              <button type="button" className="btn btn-success" onClick={handleSaveYouTube}>שמור</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelYouTube}>בטל</button>
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
                    origin: 'https://tismotek.org/', // Set the origin to your application's URL
                  }
              }}/>
                )}
                </div>
                <div className="event-projects-youtube-edit-button">
              {auth.currentUser && <button   type="button" className="btn btn-secondary" onClick={handleEditYouTube}>ערוך</button>}
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
             <span id="uploadPercentage">0%</span>
                        <progress id="uploadProgress" value="0" max="100"></progress>

              <input
                type="text"
                className="form-control"
                value={editedEventsData?.text}
                onChange={(e) =>
                  setEditedEventsData({ ...editedEventsData, text: e.target.value })
                }
              />
              <button  type="button" className="btn btn-success" onClick={handleSaveEvents}>שמור</button>
              <button  type="button" className="btn btn-secondary" onClick={handleCancelEvents}>בטל</button>
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
              <div className='event-projects-youtube-edit-button'>
              {auth.currentUser && <button  type="button" className="btn btn-secondary" onClick={handleEditEvents}>ערוך</button>}
              </div>
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
             <span id="uploadPercentage">0%</span>
                        <progress id="uploadProgress" value="0" max="100"></progress>
              <input
                type="text"
                className="form-control"
                value={editedProjectsData?.text}
                onChange={(e) =>
                  setEditedProjectsData({ ...editedProjectsData, text: e.target.value })
                }
              />
              <button type="button" className="btn btn-success" onClick={handleSaveProjects}>שמור</button>
              <button type="button" className="btn btn-secondary" onClick={handleCancelProjects}>בטל</button>
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
              <div className='event-projects-youtube-edit-button'>
              {auth.currentUser && <button  type="button" className="btn btn-secondary" onClick={handleEditProjects}>ערוך</button>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="button-container">
        {isEditingMagazine ? (
          <div>
            <input
              type="text"
              className="form-control"
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
             <span id="uploadPercentage">0%</span>
                        <progress id="uploadProgress" value="0" max="100"></progress>
            <button type="button" className="btn btn-success" onClick={handleSaveMagazine}>שמור</button>
            <button type="button" className="btn btn-secondary" onClick={handleCancelMagazine}>בטל</button>
          </div>
        ) : (
          <div className='magazine-section'>
            {magazineData && (
              <button type="button"  id="magazine" className="btn btn-primary btn-lg btn-block" onClick={() => window.open(magazineData.Url, '_blank')}>
                {magazineData.text}
              </button>
            )}
            {auth.currentUser && <button   type="button" className="btn btn-secondary" onClick={handleEditMagazine}>ערוך</button>}
          </div>
        )}
        <Articles/>
      </div>

      <HorizontalCard/>
      </>
      )}
    </div>
  );
}

export default Home;
