import React, { useState, useEffect } from 'react';
// import { components } from '.';
import { api } from '../api';
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const BookAppointment = (props) => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const [hasError, setHasError] = useState(false);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [slot, setSlot] = useState('')
    const [notUpdated, setNotUpdated] = useState(false)
    const [noAvailableSlots, setNoAvailableSlots] = useState(false)
    
    // useEffect(() => {
    //   const fetchData = async()=>{
    //   const response = await api.doctor.getAllDoctorReview(props.doctorId);
    //   setData({reviews : response.data});
    // }
    // if(!data)
    // {
    //   fetchData();
    // }
    // }, [])
    
    const getTimeDay = async (startDate) => {    
    if (startDate < new Date()){
        setHasError(true)
        return 0
    }
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = weekdays[startDate.getDay()].toLowerCase()
    if(!Object.keys(props.doctor.schedule).includes(d)){
        setHasError(true)
        return 0
    }
    else{
        setHasError(false)
        return d
    }    
  }

    const handleForm = async (e) => {
        e.preventDefault();
        let getDay = await getTimeDay(startDate)
        let date = startDate.toISOString().split('T')[0]
        // console.log(day, appointment.doctorID);
        if(getDay !== 0){
            const data = { doctorID: props.doctor._id, day: getDay, date:date };
            const availableSlots = await api.appointment.getAvailableSlots(data);
            if(availableSlots.data.length == 0) setNoAvailableSlots(true)
            else setAvailableSlots(availableSlots.data);
            // console.log(availableSlots);
        }
    };

    const getTime = (slot) => {
        let ft = slot.split(':')[0]
        if(ft.length == 1) {
            ft = '0'+ft+':'+slot.split(':')[1]+':00.000Z'
        }
        else{
            ft = ft+':00:00.000Z'
        }
        return ft
    }

    const createAppointment = async (e) => {
    e.preventDefault();
    const time = getTime(slot);
    let temp = startDate.toISOString().split('T')[0]+'T'+time
    // console.log(slot);
    const newAppointment = {doctorID: props.doctor._id, patientID: JSON.parse(localStorage.getItem('id')),  startTime: temp, appointmentLocation: props.doctor.clinicAddress}
    const udA = await api.appointment.createAppointment(newAppointment)
    // console.log(udA.data);
    if(udA.data === 'Could not add appointment'){
        setNotUpdated(true);
    }
    else{
        setNotUpdated(false)
        navigate("/dashboard");
    }
  }


  return (
    <div>
        <br />
        <h3>Book Appointment</h3>
        <br />
        <p>For your information. Dr. {props.doctor.name} is available on:</p>
        <ul>
            {Object.keys(props.doctor.schedule).map(day => {
                return <li key={day}>{day}</li>
            })}
        </ul>
        <br />
        <h4>Pick a date for your appointment</h4>
        <Form onSubmit={handleForm}>
            <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
            <Button variant="primary" type="submit" style={{ width: "70px" }}>
                Get Slots
            </Button>
        </Form>
           {hasError ? (
            <p>Doctor is unavailable that day</p>
             ):(
                
            <>
                <br />
                {availableSlots.length !== 0 ? (
                    <div>
                        {slot ? <></> : setSlot(availableSlots[0])}
                        <h3>Select slot</h3>
                    <Form onSubmit={createAppointment}>
                        <Form.Select
                            aria-label="day"
                            // value={updatedSlot}
                            onChange={(e) => setSlot(e.target.value)}
                            style={{ marginRight: "3px" }}
                            >
                            {availableSlots.map(slot => {
                                return <option value={slot} key={slot}>{slot}</option>
                            })}
                        </Form.Select>
                        <Button variant="primary" type="submit" style={{ width: "70px" }}>
                            Select
                        </Button>
                    </Form>                   
                    </div>
                ) : (
                    <>
                        {noAvailableSlots ? (
                            <p>All appointments are booked. Please try for another day.</p>
                        ) : (
                            <></>
                        )}
                        
                    </>
                )}
            </>
            )}
        {notUpdated ? 
            (
                <p>Appointment could not be added. Please try again at a later stage.</p>
            ) : ( <></> )
        }
    </div>
  )
}

export default BookAppointment;

