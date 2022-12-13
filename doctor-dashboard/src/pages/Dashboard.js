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
        <div   className='container'>
          {console.log(data)}
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" 
crossorigin="anonymous"></link>
          <div class="container-fluid pt-4 px-4">
                <div class="row g-4">
                    <div class="col-sm-12 col-xl-6">
                        <div class="bg-light rounded h-100 p-4">
                          <ul>
                              <li id="availabilityTab" onClick={handleTabChange}>Availability</li>  
                          </ul>
                        </div>
                    </div>
                    <div class="col-sm-12 col-xl-6">
                        <div class="bg-light rounded h-100 p-4">
                          <ul>
                              <li id="availabilityTab" onClick={handleTabChange}>Availability</li>  
                          </ul>
                        </div>
                    </div>
                    <div class="col-sm-12 col-xl-6">
                        <div class="bg-light rounded h-100 p-4">
                            {data && tab === 'appointmentTab' && <components.DoctorAppointment doctorId={data.doctor._id} />}
                        </div>
                    </div>
                    <div class="col-sm-12 col-xl-6">
                        <div class="bg-light rounded h-100 p-4">
                          {data && tab === 'availabilityTab' && <components.Availability doctorId={data.doctor._id} doctorSchedule={data.doctor.schedule} appointmentDuration={data.doctor.appointmentDuration} handleAvailabilityChange={handleAvailabilityChange}/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      )
}

export default Dashboard