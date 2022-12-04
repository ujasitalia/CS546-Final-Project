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
  const [day, setDay] = useState("monday");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [days,setDays] = useState([])
  const [doctor, setDoctor] = useState('')
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
      const doctor = await api.doctor.getDoctor(response.data.doctorID)
      setDoctor(doctor.data)
      const schedule = Object.keys(doctor.data.schedule)
    //   console.log(schedule);
    setDays(schedule)
    };
    if (!appointment) {
      fetchData();
    }
  }, []);

  const getTimeDay = async (startDate) => {    
    if (startDate < new Date()){
        setHasError(true)
        return 0
    }
    const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = weekdays[startDate.getDay()].toLowerCase()
    if(!days.includes(d)){
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
    // console.log(day, appointment.doctorID);
    if(getDay !== 0){
        const data = { doctorID: appointment.doctorID, day: getDay };
        const availableSlots = await api.appointment.getAvailableSlots(data);
        setAvailableSlots(availableSlots.data);
    }
  };

  const getTime = (updatedSlot) => {
    let ft = updatedSlot.split(':')[0]
    if(ft.length == 1) {
        ft = '0'+ft+':'+updatedSlot.split(':')[1]+':00.000Z'
    }
    else{
        ft = ft+':00:00.000Z'
    }
    return ft
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
        navigate("/dashboard", {state : {doctor : doctor} });
    }
  }

  return (
    <>
      <components.Navbar />
      <br />
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
          {hasError ? (
            <p>You don't work on that day doctor!</p>
             ):(
                
            <>
                <br />
                {availableSlots.length !== 0 ? (
                    <div>
                        {updatedSlot ? <></> : setUpdatedSlot(availableSlots[0])}
                        <h3>Select slot to update</h3>
                    <Form onSubmit={updateAppointment}>
                        <Form.Select
                            aria-label="day"
                            // value={updatedSlot}
                            onChange={(e) => setUpdatedSlot(e.target.value)}
                            style={{ marginRight: "3px" }}
                            >
                            {availableSlots.map(slot => {
                                return <option value={slot} key={slot}>{slot}</option>
                            })}
                        </Form.Select>
                        <Button variant="primary" type="submit" style={{ width: "70px" }}>
                            Update
                        </Button>
                    </Form>                   
                    </div>
                ) : (
                    <></>
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
