import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { Link, useNavigate} from "react-router-dom";
import { api } from '../api';

const MyAppointment = () => {
    const [data, setData] = useState('');
    const [idName, setIdName] = useState({});
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const fetchData = async()=>{
        try{
          const patientId = JSON.parse(localStorage.getItem('id'));        
          const response = await api.patient.getPatientAppointments(patientId);
          setData({appointments : response.data});
          const resDoctors = await api.doctor.getAllDoctor();
          let temp = {}
          resDoctors.data.map(doctor => {
            temp[doctor._id] = doctor.name
          })
          setIdName(temp);
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
      if(!JSON.parse(localStorage.getItem('token_data')))
      {
        navigate("/login");
      }
      if(!data)
      {
        fetchData();
      }
    },[]);

    return(
      <div>
        <components.Navbar />
        <components.SecondaryNavbar/>
        <br />
        <h1>Your Appointments</h1>
        <br />
        {hasError && <div className="error">{error}</div>}
        {data ? (
          <div>
            {data.appointments.length !== 0 ?data.appointments.map((ap, index) => {
              const name = idName[ap.doctorId]
              return (                
                <Link to={`/myAppointment/${ap._id}`} state={{appointmentId : ap._id, name: name}} style={{color:"black"}} key={index}>
                  <h2>Doctor Name: </h2> {name}
                  <h2>Appointment Time: </h2> {ap.startTime.split('T')[0]} {ap.startTime.split('T')[1].slice(0,5)}
                  <h2>Location: </h2> {ap.appointmentLocation}
                  <br />
                  <br />
                </Link>
              )
            }) 
            :
            <p>No Upcoming Appointments</p>}
          </div>
        ) : (
          <p>You have no upcoming appointments.</p>
        )}
      </div>
    )
            
}

export default MyAppointment;
