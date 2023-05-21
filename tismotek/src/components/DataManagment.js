import './DataManagment.css';
import { db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { Button, Form } from "react-bootstrap";
import React, { useState } from "react";

function DataManagment() {
  const [formData, setFormData] = useState({
    selectedCollection: "",
    textValue: "",
    imageURL: "",
    img1: "",
    text1: "",
    img2: "",
    text2: ""
  });

  const handleCollectionChange = (e) => {
    setFormData({ ...formData, selectedCollection: e.target.value });
  };

  const handleTextValueChange = (e) => {
    setFormData({ ...formData, textValue: e.target.value });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop().toLowerCase();
      let newFileName="";
      if(formData.selectedCollection === "about"){
        newFileName = "about";
      }
      const storageRef = ref(storage,`${newFileName}.${fileExtension}`);
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
              setFormData({ ...formData, imageURL: url });
            })
            .catch((error) => {
              console.log("Error getting download URL:", error);
            });
        }
      );
    }
  };

  const handleImg1Change = (e) => {
    setFormData({ ...formData, img1: e.target.value });
  };

  const handleText1Change = (e) => {
    setFormData({ ...formData, text1: e.target.value });
  };

  const handleImg2Change = (e) => {
    setFormData({ ...formData, img2: e.target.value });
  };

  const handleText2Change = (e) => {
    setFormData({ ...formData, text2: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.selectedCollection === "about") {
        await updateAboutCollection(formData.textValue, formData.imageURL);
      } else if (formData.selectedCollection === "projects") {
        await updateProjectsCollection(formData.text1, formData.img1, formData.text2, formData.img2);
      }

      setFormData({
        selectedCollection: "",
        textValue: "",
        imageURL: "",
        img1: "",
        text1: "",
        img2: "",
        text2: ""
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateAboutCollection = async (text, imageURL) => {
    const aboutDocRef = doc(db, 'about', 'LRn1319mLuETvoJ3SCWv');
    const dataToUpdate = {};

    if (text !== "") {
      dataToUpdate.text = text;
    }
    if (imageURL !== "") {
      dataToUpdate.imageUrl = imageURL;
    }

    updateDoc(aboutDocRef, dataToUpdate)
      .then(aboutDocRef => {
        console.log("Value of an Existing Document Field has been updated");
      })
      .catch(error => {
        console.log(error, "here");
      });
  };

  const updateProjectsCollection = async (text1, img1, text2, img2) => {
    console.log("Updating 'projects' collection:", text1, img1, text2, img2);
    // Implement the code to update the "projects" collection in Firestore with the provided data
  };

  return (
    <div className="form-con">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Select Collection:</Form.Label>
          <Form.Control as="select" value={formData.selectedCollection} onChange={handleCollectionChange}>
            <option value="">Select Collection</option>
            <option value="about">About</option>
            <option value="projects">Projects</option>
          </Form.Control>
        </Form.Group>
        {formData.selectedCollection === "about" && (
          <Form.Group>
            <Form.Label>Text:</Form.Label>
            <Form.Control type="text" value={formData.textValue} onChange={handleTextValueChange} />
          </Form.Group>
        )}
        {formData.selectedCollection === "about" && (
          <Form.Group>
            <Form.Label>Image URL:</Form.Label>
            <Form.Control type="file" onChange={handleImageFileChange} />
          </Form.Group>
        )}
        {formData.selectedCollection === "projects" && (
          <>
            <Form.Group>
              <Form.Label>Text 1:</Form.Label>
              <Form.Control type="text" value={formData.text1} onChange={handleText1Change} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image 1 URL:</Form.Label>
              <Form.Control type="text" value={formData.img1} onChange={handleImg1Change} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Text 2:</Form.Label>
              <Form.Control type="text" value={formData.text2} onChange={handleText2Change} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image 2 URL:</Form.Label>
              <Form.Control type="text" value={formData.img2} onChange={handleImg2Change} />
            </Form.Group>
          </>
        )}
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </div>
  );
}

export default DataManagment;
