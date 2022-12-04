import React, { useState, useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import { components } from '../components';
import { api } from '../api';

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState('appointmentTab');
    const [data, setData] = useState('');
    useEffect(() => {
      const fetchData = async()=>{
        const response = await api.doctor.getDoctor(location.state.doctor._id);
        setData({doctor : response.data});
      }
      if(!data)
      {
        fetchData();
      }
    },[]);

    const handleTabChange = (e) => {
        setTab(e.target.id); 
    }

    const handleAvailabilityChange = (doctor) => {
      setData({...data, doctor});
    }

    return (
        // <Nav/>
        <div>
          {console.log(data)}
            <ul>
              <li id="appointmentTab" onClick={handleTabChange}>Appointment</li>
              <li id="availabilityTab" onClick={handleTabChange}>Availability</li>  
            </ul>
            {data && tab === 'appointmentTab' && <components.DoctorAppointment doctorId={data.doctor._id} />}
            {data && tab === 'availabilityTab' && <components.Availability doctorId={data.doctor._id} doctorSchedule={data.doctor.schedule} handleAvailabilityChange={handleAvailabilityChange}/>}
        </div>
      )
}

export default Dashboard