import './Contacts.css';
import React, { useState, useEffect } from 'react';
import { doc, getDoc,updateDoc } from 'firebase/firestore';
import { db,auth } from '../firebase';
import { BiEnvelope, BiPhone, BiGlobe } from 'react-icons/bi';
import emailjs from 'emailjs-com';
emailjs.init('c0xAxLDDn7xvb73Qn');

function Contacts() {
    const [contactData, setContactData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContactData, setEditedContactData] = useState(null);

    useEffect(() => {
      fetchContactData();
    }, []);

    const fetchContactData = async () => {
      try {
        const docRef = doc(db, 'contacts', 'info');
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setContactData(docSnapshot.data());
          setEditedContactData(docSnapshot.data());
        }
      } catch (error) {
        console.log('Error fetching contact data:', error);
      }
    };

    function sendMail() {

        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        // Regular expression to validate email format
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            // Invalid email address
            alert("כתובת אימייל לא תקינה, אנא נסה שנית");
            return;
        }
        var message = document.getElementById("message").value;

        const serviceID = "ofriab";
        const templateID = "template_rg58kxv";

        var params = {
            name: name,
            email: email,
            message: message
        };

        emailjs
            .send(serviceID, templateID, params)
            .then((res) => {
                document.getElementById("name").value = "";
                document.getElementById("email").value = "";
                document.getElementById("message").value = "";
                console.log(res);
                alert("הודעתך נשלחה בהצלחה");
            })
            .catch((err) => console.log(err));

    }
    function handleEdit() {
        setIsEditing(true);
      }

      function handleSave() {
        updateContactData();
        setIsEditing(false);
      }

      function handleCancel() {
        setIsEditing(false);
        setEditedContactData(contactData);
      }

      const updateContactData = async () => {
        try {
          if(editedContactData.phone&&editedContactData.phone!==''){

          const mobilePhoneRegex = /^05[0-9]\d{7}$/;
          const homePhoneRegex = /^0[1-9]\d{7}$/;
          if (!mobilePhoneRegex.test(editedContactData.phone)&&!homePhoneRegex.test(editedContactData.phone)) {
              alert('מספר טלפון לא תקין אנא נסה שנית',editedContactData.phone);
              return;
          }
        }
        if(editedContactData.mail&&editedContactData.mail!==''){
           // Regular expression to validate email format
           var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
           if (!emailRegex.test(editedContactData.mail)) {
               // Invalid email address
               alert("כתובת אימייל לא תקינה, אנא נסה שנית");
               return;
           }
          }
          const docRef = doc(db, 'contacts', 'info');
          await updateDoc(docRef, editedContactData);
          setContactData(editedContactData);
        } catch (error) {
          console.log('Error updating contact data:', error);
        }
      };
      return (
        <div className='contact-container'>
          <div className="col -md-6 p-5 custom-social-orange text-white">
            {contactData && !isEditing &&(
              <div className='contacts-info'>
                <div>
                  <BiEnvelope />
                </div>
                <div>
                  {contactData.mail}
                </div>
                <div>
                  <BiGlobe />
                </div>
                <div>
                  {contactData.location}
                </div>
                <div>
                  <BiPhone />
                </div>
                <div>
                  {`${contactData.phone}`}
                </div>
                <div className='info-text'>
                  {contactData.text}
                </div>
              </div>
            )}
            {isEditing ? (
              <div>
                {/* Render the editable fields */}
                <input
                  type="email"
                  className='form-control'
                  value={editedContactData.mail}
                  onChange={(e) =>{

                    setEditedContactData({
                      ...editedContactData,
                      mail: e.target.value
                    })
                  }}
                />

                 <input
                  type="text"
                  className='form-control'
                  value={editedContactData.location}
                  onChange={(e) =>
                    setEditedContactData({
                      ...editedContactData,
                      location: e.target.value
                    })
                  }
                />
                 <input
                  type="text"
                  className='form-control'
                  value={editedContactData.phone}
                  onChange={(e) =>{
                    setEditedContactData({
                      ...editedContactData,
                      phone: e.target.value
                    })
                  }
                }
                />
                 <input
                  type="text"
                  className='form-control'
                  value={editedContactData.text}
                  onChange={(e) =>
                    setEditedContactData({
                      ...editedContactData,
                     text: e.target.value
                    })
                  }
                />
                {/* Repeat for other fields */}
              </div>
            ) : (
              // Render the "Edit" button when not editing and user is authenticated
              auth.currentUser && (
                <button className="btn btn-secondary" onClick={handleEdit}>ערוך</button>
              )
            )}
            {/* Render the "Save" and "Cancel" buttons when editing and user is authenticated */}
            {isEditing && auth.currentUser && (
              <div>
                <button  className="btn btn-success" onClick={handleSave}>שמור</button>
                <button className="btn btn-secondary" onClick={handleCancel}>בטל</button>
              </div>
            )}
          </div>
          <div className="col -md-6 py-3">
            <h1>טופס יצירת קשר</h1>
            <div className="form-group">
              <h5 htmlFor="name">:שם</h5>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="הכנס את שמך"
              />
            </div>
            <div className="form-group">
              <h5 htmlFor="email">:כתובת מייל</h5>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="הכנס כתובת מייל"
              />
            </div>
            <div className="form-group">
              <h5 htmlFor="message">:הודעה</h5>
              <textarea id="message" rows="3" className="form-control"></textarea>
            </div>
            <button className="btn" onClick={sendMail} style={{ backgroundColor: "#1E3A8A", color: "#fff" }}>שלח</button>
          </div>
        </div>
      );
            }

export default Contacts;