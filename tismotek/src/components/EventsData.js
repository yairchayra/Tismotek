import { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import ExcelJS from 'exceljs';
import { collection, getDocs, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { Table, Button } from 'react-bootstrap';
import './EventsData.css'
import { Chart } from 'react-google-charts';


function EventsData() {
    const [events, setEvents] = useState([]);
    const [excelGenerated, setExcelGenerated] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // Create a new array with the data for the line chart
        const chartDataArray = events.map((event) => [event.title, event.nop]);
        // Add the column headers as the first element in the array
        chartDataArray.unshift(['Event', 'מספר משתתפים']);
        // Update the state variable
        setChartData(chartDataArray);
    }, [events]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'events'));
                const fetchedEvents = [];

                querySnapshot.forEach((doc) => {
                    const event = doc.data();
                    const eventId = doc.id;

                    fetchedEvents.push({ ...event, id: eventId });
                });

                setEvents(fetchedEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        const unsubscribe = onSnapshot(collection(db, 'events'), () => {
            fetchEvents();
        });

        fetchEvents(); // Fetch events initially

        return () => unsubscribe();
    }, []);

    const generateExcel = async (event) => {
        try {
            const participants = event.participants;

            if (participants.length > 0) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Participants');

                worksheet.addRow(['Full Name', 'Email', 'Phone Number', 'Address', 'Number of Participants']);

                participants.forEach((participant) => {
                    worksheet.addRow([
                        participant.fullName,
                        participant.email,
                        participant.phoneNumber,
                        participant.address,
                        participant.numberOfParticipants.toString(),
                    ]);
                });

                const buffer = await workbook.xlsx.writeBuffer();
                const filename = `events-page/excel/${event.id}_participants.xlsx`;
                const fileRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(fileRef, buffer);

                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        // Track upload progress if needed
                    },
                    (error) => {
                        console.error('Error uploading Excel file:', error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            updateDoc(doc(db, 'events', event.id), { excelUrl: downloadURL }).then(() => {
                                setExcelGenerated((prevExcelGenerated) => [...prevExcelGenerated, event.id]);
                            });
                        });
                    }
                );
            } else {
                alert('אין רשומים לאירוע זה');
            }
        } catch (error) {
            console.error('Error generating Excel file:', error);
        }
    };

    const deleteExcelFile = async (event) => {
        try {
            if (event.excelUrl && event.excelUrl !== '') {
                const filename = `events-page/excel/${event.id}_participants.xlsx`;
                const fileRef = ref(storage, filename);

                await deleteObject(fileRef);
                updateDoc(doc(db, 'events', event.id), { excelUrl: '' }).then(() => {
                    setExcelGenerated((prevExcelGenerated) => prevExcelGenerated.filter((id) => id !== event.id));
                });
            }
        } catch (error) {
            console.error('Error deleting Excel file:', error);
        }
    };

    const handleDownload = async (excelUrl) => {
        try {
            const downloadUrl = await getDownloadURL(ref(storage, excelUrl));
            window.open(downloadUrl);
        } catch (error) {
            console.error('Error downloading Excel file:', error);
        }
    };

    return (
        <div className='eventsData-container'>
            <h2>מידע אירועים</h2>
            <div className='eventData-table'>
                <Table striped bordered >
                    <thead>
                        <tr>
                            <th>פעולות</th>
                            <th>כותרת אירוע</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td>
                                    {event.excelUrl && (
                                        <Button variant="primary" onClick={() => handleDownload(event.excelUrl)}>
                                            הורד קובץ אקסל
                                        </Button>
                                    )}
                                    {!excelGenerated.includes(event.id) && (
                                        <Button variant="success" onClick={() => generateExcel(event)}>
                                            יצר קובץ אקסל חדש
                                        </Button>
                                    )}
                                    {event.excelUrl && event.excelUrl !== '' && (
                                        <Button variant="danger" onClick={() => deleteExcelFile(event)}>
                                            מחק קובץ אקסל
                                        </Button>
                                    )}
                                </td>
                                <td>{event.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                </div>
    {excelGenerated.length > 0 && <p>Excel files generated for the events: {excelGenerated.join(', ')}</p>}
    <div className='nop-chart'>
    <Chart
  width={'615px'}
  height={'100%'}
  chartType="ColumnChart"
  loader={<div>Loading Chart</div>}
  data={chartData}
  options={{
    title: 'מספר משתתפים לכל אירוע',
    vAxis: {
      title: 'מספר משתתפים',
    },

    legend: 'none',
    bar: { groupWidth: '40%' },
    chartArea: { width: '80%', height: '70%' }, // Set the size of the chart area
    backgroundColor: '#EEEEEE', // Set the background color of the chart
    borderWidth: '1', // Add a border to the chart
    borderColor: 'black', // Set the border color
  }}
/>

    </div>
  </div>
);
}

export default EventsData;
