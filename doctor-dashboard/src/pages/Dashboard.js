import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';

const Dashboard = () => {
    const [tab, setTab] = useState('appointmentTab');
    const [data, setData] = useState('');
    useEffect(() => {
      const fetchData = async()=>{
        const response = await api.doctor.getDoctor(JSON.parse(localStorage.getItem('id')));
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
      <div>
        {data && <components.Navbar/>}
        <div>
          {console.log(data)}
            <ul>
              <li id="appointmentTab" onClick={handleTabChange}>Appointment</li>
              <li id="availabilityTab" onClick={handleTabChange}>Availability</li>  
            </ul>
            {data && tab === 'appointmentTab' && <components.DoctorAppointment doctorId={data.doctor._id}/>}
            {data && tab === 'availabilityTab' && <components.Availability doctorId={data.doctor._id} doctorSchedule={data.doctor.schedule} handleAvailabilityChange={handleAvailabilityChange}/>}
        </div>
      </div>
      )
}

export default Dashboard