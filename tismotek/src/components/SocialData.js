import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Button } from "react-bootstrap";
import "./SocialData.css";
import { Chart } from "react-google-charts";





function SocialData() {

    const [clickData, setClickData] = useState({});

    useEffect(() => {
        const fetchClickData = async () => {
            try {
                const docRef = doc(db, "social", "clicks");
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    setClickData(docSnapshot.data());
                }
            } catch (error) {
                console.error("Error fetching click data:", error);
            }
        };

        fetchClickData();
    }, []);

    const handleResetClicks = async () => {
        const shouldDelete = window.confirm('האם אתה בטוח שתרצה לאפס את מד הלחיצות?');
        if (shouldDelete) {
        try {
            const currentDate = new Date();
            const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

            const clickDataToUpdate = {
                facebook: 0,
                instagram: 0,
                youtube: 0,
                whatsapp: 0,
                date: formattedDate,
            };

            await setDoc(doc(db, "social", "clicks"), clickDataToUpdate);
            setClickData(clickDataToUpdate);
        } catch (error) {
            console.error("Error resetting click data:", error);
        }
        }
    };

    return (
        <div className="socialData-container">
          <h2>מידע רשתות חברתיות</h2>
          <div className="container">
          <div className="chart-container">
          <Chart
            width={"400px"}
            height={"400px"}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={[
              ["רשת חברתית", "כניסות"],
              ["Facebook", clickData.facebook],
              ["Instagram", clickData.instagram],
              ["YouTube", clickData.youtube],
              ["WhatsApp", clickData.whatsapp],
            ]}
            options={{
              title: "אחוז הכניסות לכל רשת חברתית",
              is3D: true,
            }}
            rootProps={{ "data-testid": "1" }}
          />
        </div>

            <div className="table-container">
              <p>:מידע מתאריך {clickData.date}</p>
              <Table striped bordered hover>
              <thead>
                        <tr>
                            <th>רשת חברתית</th>
                            <th>כניסות</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Facebook</td>
                            <td>{clickData.facebook}</td>
                        </tr>
                        <tr>
                            <td>Instagram</td>
                            <td>{clickData.instagram}</td>
                        </tr>
                        <tr>
                            <td>YouTube</td>
                            <td>{clickData.youtube}</td>
                        </tr>
                        <tr>
                            <td>WhatsApp</td>
                            <td>{clickData.whatsapp}</td>
                        </tr>
                    </tbody>
              </Table>
              <Button variant="primary" onClick={handleResetClicks}>
                אפס לחיצות
              </Button>
            </div>
          </div>
        </div>
      );
}

export default SocialData;
