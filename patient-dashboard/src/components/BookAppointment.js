import React, { useState } from 'react';
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
    
    const checkDate = (startDate) => {  
    const currDate = new Date();  
    if(startDate.getDate() < currDate.getDate()){
        setHasError(true)
        return false;
    }
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = weekdays[startDate.getDay()].toLowerCase()
    if(!Object.keys(props.doctor.schedule).includes(d)){
        setHasError(true)
        return false;
    }
    else{
        setHasError(false)
        return true;
    }    
  }

    const handleForm = async (e) => {
        e.preventDefault();
        if(!checkDate(startDate))
            return;
        const response = await api.doctor.getDoctorSlot(props.doctor._id, startDate.toLocaleDateString());
        const slots = response.data.filter(element =>{
            let time = element[0].split(":")
            let curTime = new Date();
            if((startDate.getDate() !== curTime.getDate()) || (parseInt(time[0])>curTime.getHours() || (parseInt(time[0])===curTime.getHours() && parseInt(time[1])>curTime.getMinutes())))
                return element;
            })
        setAvailableSlots(slots);
    };

    const getTime = (slot) => {
        slot = slot.split(':')
        slot = slot[0]+':'+slot[1]+':00.000'
        return slot
    }

    const createAppointment = async (e) => {
    e.preventDefault();
    const time = getTime(slot);
    let temp = startDate.toISOString().split('T')[0]+'T'+time
    // console.log(slot);
    const newAppointment = {doctorId: props.doctor._id, patientId: JSON.parse(localStorage.getItem('id')),  startTime: temp, appointmentLocation: props.doctor.clinicAddress}
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
        <br/>
        <p>Appointment Duration : {props.doctor.appointmentDuration}</p>
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
                        {slot ? <></> : setSlot(availableSlots[0][0])}
                        <h3>Select slot</h3>
                    <Form onSubmit={createAppointment}>
                        <Form.Select
                            aria-label="day"
                            // value={updatedSlot}
                            onChange={(e) => setSlot(e.target.value)}
                            style={{ marginRight: "3px" }}
                            >
                            {availableSlots.map(slot => {
                                return <option value={slot[0]} key={slot[0]}>{slot[0] + " - " + slot[1]}</option>
                            })}
                        </Form.Select>
                        <Button variant="primary" type="submit" style={{ width: "70px" }}>
                            Select
                        </Button>
                    </Form>                   
                    </div>
                ) : (
                    <>
                        <p>All appointments are booked. Please try for another day.</p>
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

