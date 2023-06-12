import 'firebase/compat/firestore';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import emailjs from 'emailjs-com';

emailjs.init('c0xAxLDDn7xvb73Qn');

function NewsLetterMessage() {
  async function sendMessage() {
    try {
      const querySubscriberList = await getDocs(collection(db, 'subscribers'));
      const subscribersList = querySubscriberList.docs.map((doc) => doc.data().email);

      const serviceID = 'ofriab';
      const templateID = 'template_rg58kxv';

      var subject = document.getElementById('subject').value;
      var message = document.getElementById('message').value;

      // Iterate through the subscriber list
      subscribersList.forEach((subscriber) => {
        // Prepare the email content and variables
        console.log(subscriber);
        const templateParams = {
          to_email: subscriber,
          subject: subject,
          message: message,
        };

        // Use EmailJS to send the email
        emailjs.send(serviceID, templateID, templateParams)
          .then((response) => {
            document.getElementById('subject').value = '';
            document.getElementById('message').value = '';
            console.log(response);

          })
          .catch((error) => {
            console.error('Email sending error:', error);
          });

      });
      alert('הודעתך נשלחה בהצלחה');

    }

    catch (error) {
      console.error('Error fetching subscribers:', error);
    }
  }

  return (
    <div className='newsletter'>
    <div className="container border mt-3 bg-light" id="container">
      <div className="col -md-3 py-3" style={{ textAlign: 'right' }}>
        <h5>שליחת הודעה לרשימת התפוצה</h5>
        <div className="form-group">
          <input type="text" className="form-control" id="subject" placeholder="נושא ההודעה" />
        </div>
        <div className="form-group">
          <input type="text" className="form-control" id="message" placeholder="ההודעה" />
        </div>
        <button
          className="btn"
          onClick={sendMessage}
          style={{ backgroundColor: '#1E3A8A', color: '#fff' }}
        >
          שליחה לרשימת התפוצה
        </button>
      </div>
    </div>
    </div>
  );
}

export default NewsLetterMessage;


