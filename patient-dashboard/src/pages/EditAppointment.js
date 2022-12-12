import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { components } from "../components";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [appointment, setAppointment] = useState("");
  const [days,setDays] = useState([])
  const [doctor, setDoctor] = useState('')
  const [availableSlots, setAvailableSlots] = useState('');
//   const [days,setDays] = useState([])
//   const [doctor, setDoctor] = useState('')
  const [updatedSlot, setUpdatedSlot] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [hasError, setHasError] = useState(false);
  const [notUpdated, setNotUpdated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.appointment.getAppointmentById(
        location.state.appointmentId
      );
      //   console.log(response.data);
      setAppointment(response.data);
      const doctor = await api.doctor.getDoctor(response.data.doctorId)
      setDoctor(doctor.data)
      const schedule = Object.keys(doctor.data.schedule)
      setDays(schedule)
    //   console.log(schedule);        
    };
    if (!appointment) {
      fetchData();
    }
  }, []);

  const checkDate = (startDate) => {  
    // console.log('checkDate', startDate);  
    const currDate = new Date();
    if(startDate.getDate() < currDate.getDate()){      
        setHasError(true)
        return false
    }
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = weekdays[startDate.getDay()].toLowerCase()
    if(!days.includes(d)){      
        setHasError(true)
        return false
    }
    else{
        setHasError(false)
        return true
    }    
  }

  const handleForm = async (e) => {
    e.preventDefault();
    if(!checkDate(startDate))
      return;
    const response = await api.doctor.getDoctorSlot(appointment.doctorId, startDate.toLocaleDateString());
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

  const updateAppointment = async (e) => {
    e.preventDefault();
    const time = getTime(updatedSlot);
    let temp = startDate.toISOString().split('T')[0]+'T'+time
    // console.log(updatedSlot);
    const updatedAppointment = {...appointment, startTime:temp}
    const udA = await api.appointment.updateAppointment(updatedAppointment)
    if(udA.data === 'select a different date/time than original'){
        setNotUpdated(true);
    }
    else{
        setNotUpdated(false)
        navigate("/myAppointments", {state : {doctor : doctor} });
    }
  }

  const handleCancel = async (e) => {
    e.preventDefault()
    const cancelRequest = await api.appointment.deleteAppointment(location.state.appointmentId)
    navigate("/myAppointments", {state : {doctor : doctor} });
  }

  return(
    <div>
        <components.Navbar />
        <components.SecondaryNavbar/>
        {appointment ? (
        <div style={{marginLeft: "5px"}}>
            <h2 style={{position:"center"}}>Edit/Cancel Appointment</h2>
            <br />
            <h4>Original Appointment</h4>
          <div className="card">
            <div className="cardText">
              Date : {appointment.startTime.slice(0, 10)}
            </div>
            <div className="cardText">
              Time : {appointment.startTime.slice(11, 19)}
            </div>
          </div>
          <br />
          <h4>Would you like to cancel the appointment?</h4>
          <Button variant="danger" type="button" onClick={handleCancel} style={{ width: "70px" }}>
              Cancel
          </Button>
          <br />
          <br />
          <h4>Dr. {doctor.name} is available on:</h4>
          <ul>
            {days.map(d => {
              return <li key={d}>{d}</li>
            })}
          </ul>
          <br />
          <h4>Update to:</h4>
          <Form onSubmit={handleForm}>
            <Form.Label style={{ marginRight: "10px" }}>Date</Form.Label>            
            <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
            <Button variant="primary" type="submit" style={{ width: "70px" }}>
              Get Slots
            </Button>
          </Form>
          <br />
          {hasError ? (
            <p>Doctor is unavailable on that day doctor!</p>
             ):(
                
            <>
                <br />
                {console.log()}
                {availableSlots.length !== 0 ? (
                    <div>
                        {updatedSlot ? <></> : setUpdatedSlot(availableSlots[0][0])}
                        <h3>Select slot to update</h3>
                    <Form onSubmit={updateAppointment}>
                        <Form.Select
                            aria-label="day"
                            // value={updatedSlot}
                            onChange={(e) => setUpdatedSlot(e.target.value)}
                            style={{ marginRight: "3px" }}
                            >
                            {availableSlots.map(slot => {
                                return <option value={slot[0]} key={slot[0]}>{slot[0] + " - " + slot[1]}</option>
                            })}
                        </Form.Select>
                        <Button variant="primary" type="submit" style={{ width: "70px" }}>
                            Update
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
            {notUpdated ? 
                (
                    <p>Select a different date/time than original</p>
                ) : ( <></> )
            }
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default EditAppointment 