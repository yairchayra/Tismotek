import './Contacts.css';
import emailjs from 'emailjs-com';
import { Button } from 'react-bootstrap';
emailjs.init('CAfLe4anS8INvMHrB');

function Contacts() {

    function sendMail(){

        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
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
            .then((res)=> {
                document.getElementById("name").value = "";
                document.getElementById("email").value = "";
                document.getElementById("message").value = "";
                console.log(res);
                alert("הודעתך נשלחה בהצלחה");
            })
            .catch((err)=> console.log(err));
    
    }

    return (   
        <div className="container border mt-3 bg-light">
            <div className="row">
                <div className="col -md-6 p-5 custom-social-orange text-white">
                    <h4 style={{ color: "darkblue" }}>
                        טלפון העמותה :
                        מייל : 
                        כתובת :
                    </h4>
                </div>
                <div className="col -md-6 py-3">
                    <h1>טופס יצירת קשר</h1>
                    <div className="form-group">
                        <h5 for="name">:שם</h5>
                        <input
                            type="text"
                            class="form-control"
                            id="name"
                            placeholder="הכנס את שמך"
                        />
                    </div>
                    <div className="form-group">
                        <h5 for="email">:כתובת מייל</h5>
                        <input
                            type="text"
                            class="form-control"
                            id="email"
                            placeholder="הכנס כתובת מייל"
                        />
                    </div>
                    <div className="form-group">
                        <h5 for="message">:הודעה</h5>
                        <textarea id="message" rows="3" class="form-control"></textarea>
                    </div>
                    <button className="btn" onClick={sendMail} style={{backgroundColor: "#1E3A8A", color: "#fff"}}>שלח</button>

                </div>
            </div>
            
        </div>
    );
}

export default Contacts;