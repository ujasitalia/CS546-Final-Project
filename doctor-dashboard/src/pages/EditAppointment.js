import React, { useState, useEffect } from "react";
import { components } from "../components";
import { api } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState("");
  const [availableSlots, setAvailableSlots] = useState('');
  const [days,setDays] = useState([])
  const [doctor, setDoctor] = useState('')
  const [updatedSlot, setUpdatedSlot] = useState('')
  const [startDate, setStartDate] = useState(new Date());
  const [notAvailable, setNotAvailable] = useState(false);
  const [notUpdated, setNotUpdated] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await api.appointment.getAppointmentById(appointmentId);
        setAppointment(response.data);
        const doctor = await api.doctor.getDoctor(response.data.doctorId)
        setDoctor(doctor.data)
        const schedule = Object.keys(doctor.data.schedule)
        setDays(schedule)
        setHasError(false);
      }catch(e){
        if(e.response.status===500)
          navigate("/error");
        else if(e.response.status===401 )
        {
          localStorage.clear();
          navigate("/login");
        }else{
          setHasError(true);
          setError(e.response.data);
        }
      }
    };
    if(!JSON.parse(localStorage.getItem('token_data')))
    {
      navigate("/login");
    }
    if (!appointment) {
      fetchData();
    }
  }, []);

  const checkDate = (startDate) => {    
    const currDate = new Date();
    if(startDate.getDate() < currDate.getDate()){
        setNotAvailable(true)
        return false
    }
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = weekdays[startDate.getDay()].toLowerCase()
    if(!days.includes(d)){
        setNotAvailable(true)
        return false
    }
    else{
        setNotAvailable(false)
        return true
    }    
  }

  const handleForm = async (e) => {
    e.preventDefault();
    if(!checkDate(startDate))
      return;
    try{
      const response = await api.doctor.getDoctorSlot(appointment.doctorId, startDate.toLocaleDateString());
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
      else if(e.response.status===401 )
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

  const updateAppointment = async (e) => {
    e.preventDefault();
    const time = getTime(updatedSlot);
    let temp = (new Date(startDate - (startDate.getTimezoneOffset() * 60000))).toISOString().split('T')[0]+'T'+time
    const updatedAppointment = {startTime:temp}
    try{
      const udA = await api.appointment.updateAppointment(appointmentId, updatedAppointment)
      if(udA.data === 'select a different date/time than original'){
          setNotUpdated(true);
      }
      else{
          setNotUpdated(false)
          navigate("/dashboard", {state : {doctor : doctor} });
      }
      setHasError(false);
    }catch(e){
      if(e.response.status===500)
        navigate("/error");
      else if(e.response.status===401 )
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
    <>
      <components.Navbar />
      <br />
      {hasError && <div className="error">{error}</div>}
      {appointment ? (
        <>
            <h2 style={{position:"center"}}>Edit Appointment</h2>
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
          <h4>Update to:</h4>
          <Form onSubmit={handleForm}>
            <Form.Label style={{ marginRight: "10px" }}>Date</Form.Label>            
            <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
            <Button variant="primary" type="submit" style={{ width: "70px" }}>
              Get Slots
            </Button>
          </Form>
          <br />
          {notAvailable ? (
            <p>You don't work on that day doctor!</p>
             ):(
                
            <>
                <br />
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
        </>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default EditAppointment;