import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import { useParams } from 'react-router-dom';

const DoctorInfo = () => {
    const { id } = useParams();
    const [tab, setTab] = useState('detailTab');
    const [data, setData] = useState('');
    useEffect(() => {
      const fetchData = async()=>{
        const response = await api.doctor.getDoctor(id);
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
  return (
    <div>
        <components.Navbar/>
        <components.SecondaryNavbar/>
        <ul>
            <li id="detailTab" onClick={handleTabChange}>Details</li>
            <li id="doctorAvailabilityTab" onClick={handleTabChange}>Doctor's Availability</li> 
            <li id="reviewTab" onClick={handleTabChange}>Reviews</li>
            <li id="bookAppointment" onClick={handleTabChange}>Book Appointment</li> 
        </ul>
        {data && tab === 'detailTab' && <components.DoctorDetail doctor={data.doctor}/>}
        {data && tab === 'doctorAvailabilityTab' && <components.DoctorAvailability doctorSchedule={data.doctor.schedule}/>}
        {data && tab === 'reviewTab' && <components.DoctorReviews doctorId={data.doctor._id}/>} 
        {data && tab === 'bookAppointment' && <components.BookAppointment doctor={data.doctor}/>}
    </div>
  )
}

export default DoctorInfo;