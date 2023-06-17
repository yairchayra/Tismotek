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
      <DonationEdit/>
      <LogoEdit/>
      <NewsletterExport/>
      <NewsLetterMessage/>

    </div>
  );
};

export default Dashboard;
