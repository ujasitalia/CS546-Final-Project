import React, { useState } from 'react';
import { api } from '../api';
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const BookAppointment = (props) => {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(new Date());
    const [notAvailable, setNotAvailable] = useState(false);
    const [availableSlots, setAvailableSlots] = useState('');
    const [slot, setSlot] = useState('')
    const [onlineAppointment, setOnlineAppointment] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    
    const checkDate = (startDate) => {  
    const currDate = new Date();  
    if(startDate.getDate() < currDate.getDate()){
        setNotAvailable(true)
        return false;
    }
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = weekdays[startDate.getDay()].toLowerCase()
    if(!Object.keys(props.doctor.schedule).includes(d)){
        setNotAvailable(true)
        return false;
    }
    else{
        setNotAvailable(false)
        return true;
    }    
  }

    const handleForm = async (e) => {
        e.preventDefault();
        if(!checkDate(startDate))
            return;
        try{
            const response = await api.doctor.getDoctorSlot(props.doctor._id, startDate.toLocaleDateString());
            const slots = response.data.filter(element =>{
                let time = element[0].split(":")
                let curTime = new Date();
                if((startDate.getDate() !== curTime.getDate()) || (parseInt(time[0])>curTime.getHours() || (parseInt(time[0])===curTime.getHours() && parseInt(time[1])>curTime.getMinutes())))
                    return element;
                })
            setAvailableSlots(slots);
            setHasError(false);
        }catch(e){
          if(e.response.status===500)
            navigate("/error");
          else if(e.response.status===401 || e.response.status===403)
          {
            localStorage.clear();
            navigate("/login");
          }else{
            setHasError(true);
            setError(e.response.data);
          }
        }
    };

    const getTime = (slot) => {
        slot = slot.split(':')
        slot = slot[0]+':'+slot[1]+':00.000'
        return slot
    }

    const createAppointment = async (e) => {
    e.preventDefault();
    const time = getTime(slot);
    let temp = (new Date(startDate - (startDate.getTimezoneOffset() * 60000))).toISOString().split('T')[0]+'T'+time
    // console.log(slot);
    let loc;
    if(onlineAppointment == 'true'){
        loc = props.doctor.link
    }
    else{
        loc = props.doctor.clinicAddress
    }
    const newAppointment = {doctorId: props.doctor._id, patientId: JSON.parse(localStorage.getItem('id')),  startTime: temp, appointmentLocation: loc}
    try{
        const udA = await api.appointment.createAppointment(newAppointment)
        navigate("/dashboard");
    }catch(e){
        if(e.response.status===500)
        navigate("/error");
        else if(e.response.status===401 || e.response.status===403)
        {
        localStorage.clear();
        navigate("/login");
        }else{
        setHasError(true);
        setError(e.response.data);
        }
    }
  }


  return (
    <div>
        
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet"></link>
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
        {hasError && <div className="error">{error}</div>}
        <h4>Pick a date for your appointment</h4>
        <Form onSubmit={handleForm}>
            <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
            <Button variant="primary" type="submit" style={{ width: "100px" }}>
                Get Slots
            </Button>
        </Form>
           {notAvailable ? (
            <p>Doctor is unavailable that day</p>
             ):(
                
            <>
                <br />
                {availableSlots.length !== 0 ? (
                    <div>
                        {slot ? <></> : setSlot(availableSlots[0][0])}
                        <h3>Select slot</h3>
                    <Form onSubmit={createAppointment}>
                        <Row>
                            <Col>
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
                            </Col>
                            <Col>
                                <h3>Online Appointment ?</h3>   
                                <Form.Select onChange={e => setOnlineAppointment(e.target.value)}     style={{ marginRight: "3px" }} value={onlineAppointment}>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </Form.Select> 
                            </Col>
                        </Row>  
                        <br />                      
                        <Button variant="primary" type="submit" style={{ width: "70px" }}>
                            Select
                        </Button>
                    </Form>                   
                    </div>
                ) : (
                    <>
                       {availableSlots  &&  <p>All slots are booked. Please try for another day.</p>}
                    </>
                )}
            </>
            )}
    </div>
  )
}

export default BookAppointment;

