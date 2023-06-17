import React from 'react';
import { db } from '../firebase';
import ExcelJS from 'exceljs';
import { collection, getDocs } from 'firebase/firestore';

function NewsletterExport() {
  const handleExportClick = async () => {
    const subscribersRef = collection(db, 'subscribers');

    try {
      const subscribersSnapshot = await getDocs(subscribersRef);
      const subscribersData = [];

      subscribersSnapshot.forEach((doc) => {
        const { email } = doc.data();
        subscribersData.push({ email });
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Subscribers');
      worksheet.columns = [{ header: 'Email', key: 'email' }];
      subscribersData.forEach((subscriber) => {
        worksheet.addRow(subscriber);
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'subscribers.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting subscribers:', error);
    }
  };

  return (
    <div>
      <button className='btn btn-primary 'onClick={handleExportClick} style={{ marginTop: '20px' }}>ייצא רשימת תפוצה לקובץ אקסל</button>
    </div>
  );
}

export default NewsletterExport;
