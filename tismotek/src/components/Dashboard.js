import React from "react";
import './Dashboard.css';
import DonationEdit from "./DonationEdit";
import LogoEdit from "./LogoEdit";
import NewsLetterMessage from "./NewsLetterMessage"
import NewsletterExport from "./NewsletterExport"

const Dashboard = () => {

  return (
    <div className="dashboard-container">
      <h2>אזור אישי</h2>
      <h5>פעולות אלה ברות השפעה על האתר כולו אנא השתמשו בהן בתבונה </h5>
      <DonationEdit/>
      <LogoEdit/>
      <NewsletterExport/>
      <NewsLetterMessage/>

    </div>
  );
};

export default Dashboard;
