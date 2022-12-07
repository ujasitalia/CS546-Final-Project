import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';

const Profile = () => {
    const [data, setData] = useState('');
    useEffect(() => {
      const fetchData = async()=>{
        const response = await api.patient.getPatientAppointments();
        setData({appointments : response.data});
      }
      if(!data)
      {
        fetchData();
      }
    },[]);

    return(
        <div>
            <components.Navbar />
            
        </div>
    )
}

export default Profile;