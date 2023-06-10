
import 'firebase/compat/firestore';
import { db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";

function Subscribe() {

    function joinNewsletter() {

        var email = document.getElementById("email").value;
        // Regular expression to validate email format
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            // Invalid email address
            alert("כתובת אימייל לא תקינה, אנא נסה שנית");
            return;
        }
        // Add a new document in collection "cities"
        setDoc(doc(db, "subscribers", email), {
            email: email
        });

    }

    return (
        <div className="container border mt-3 bg-light" id="container">

            <div className="col -md-3 py-3" style={{ textAlign: 'right' }}>
                <h5>הצטרפות לרשימת התפוצה</h5>
                <div className="form-group">
                    {/* <h5 htmlFor="email">:כתובת אימייל</h5> */}
                    <input
                        type="text"
                        className="form-control"
                        id="email"
                        placeholder="הכנס כתובת אימייל"
                    />
                </div>
                <button className="btn" onClick={joinNewsletter} style={{ backgroundColor: "#1E3A8A", color: "#fff" }}>להצטרפות</button>

            </div>
        </div>

    )
}

export default Subscribe;