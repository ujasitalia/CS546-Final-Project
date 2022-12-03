import React, { useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import { api } from '../api';

const DoctorAppointment = (props) => {
  const [appointments, setAppointments] = useState('');
  const fetchData = async () =>{
    const response = await api.appointment.getDoctorAppointment(props.doctorId);
    setAppointments(response.data);
    console.log(response.data);
  }
  useEffect(() => {
    if(appointments === '')
      fetchData();
  },[]);
  return (
    <div>
      {appointments !== '' 
      ? <div className="appointmentContainer">
                    <div>{appointments.length !== 0 ? appointments.map((element, index) =>
                    <Link to={{ pathname : `/dashboard/appointment/${element._id}`, state : {appointmentId : element._id}}}>
                        <div className="card" key={element._id}>
                            <div className="cardHeading">Appointment - {index+1}</div>
                            <div className="cardText">Date : {element.startTime.slice(0, 10)}</div>
                            <div className="cardText">Time : {element.startTime.slice(11,19)}</div>
                        </div>
                      </Link>
                    ) : <p>"No Upcoming Appointments"</p>}
                    </div>
      </div> : <div>Loading</div>}
    </div>
  )
}
export default DoctorAppointment