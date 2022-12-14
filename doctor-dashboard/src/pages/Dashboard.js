import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import Chat from '../components/Chat'
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [tab, setTab] = useState('appointmentTab');
    const [data, setData] = useState('');
    const navigate = useNavigate();
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      const fetchData = async()=>{
        try{
          const response = await api.doctor.getDoctor(JSON.parse(localStorage.getItem('id')));
          setData({doctor : response.data});
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

    const handleTabChange = (e) => {
        setTab(e.target.id); 
    }

    const handleAvailabilityChange = (doctor) => {
      setData({...data, doctor});
    }

    return (
      <div>
        {data && <components.Navbar/>}
        <nav style={{paddingTop: "10px", marginBottom: "10px", paddingBottom: "8px"}}>
            <div className="nav-center">
                <div className="links-container">
                    <ul className="links">
                      <li id="appointmentTab" className='linkLi' onClick={handleTabChange}>Appointment</li>  
                      <li id="availabilityTab" className='linkLi' onClick={handleTabChange}>Availability</li>  
                    </ul>
                </div>
            </div>
          </nav>
        <div className='container'>
        {hasError && <div className="error">{error}</div>}
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" 
crossOrigin="anonymous"></link>
          <div  className="container-fluid pt-4 px-4">
              <div  className="row g-4">
                  <div >
                      <div>
                        {data && tab === 'appointmentTab' && <components.DoctorAppointment doctorId={data.doctor._id} />}
                      </div>
                  </div>
                  <div>
                      <div>
                        {data && tab === 'availabilityTab' && <components.Availability doctorId={data.doctor._id} doctorSchedule={data.doctor.schedule} appointmentDuration={data.doctor.appointmentDuration} handleAvailabilityChange={handleAvailabilityChange}/>}
                      </div>
                  </div>
              </div>
            </div>
        </div>
        <Chat/>
      </div>
      )
}

export default Dashboard
