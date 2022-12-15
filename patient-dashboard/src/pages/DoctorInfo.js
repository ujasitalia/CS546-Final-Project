import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import { useParams, useNavigate} from 'react-router-dom';
import "../components/navbar.css";
const DoctorInfo = () => {
    const { id } = useParams();
    const [tab, setTab] = useState('detailTab');
    const [data, setData] = useState('');
    const [canGiveReview, setCanGiveReview] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      const fetchData = async()=>{
        try{
          const response = await api.doctor.getDoctor(id);
          setData({doctor : response.data});
          for(let element of response.data.myPatients)
          {
            if(element[0] === JSON.parse(localStorage.getItem('id')))
            {
              setCanGiveReview(!element[1]);
              break;
            }
          };
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
  return (
    <div>
        <components.Navbar/>
        <components.SecondaryNavbar/>
    <nav>
      <div className="nav-center">
        <div className="links-container">
          <ul className="links">
            <li id="detailTab" onClick={handleTabChange}>Details</li>
            <li id="doctorAvailabilityTab" onClick={handleTabChange}>Doctor's Availability</li> 
            <li id="reviewTab" onClick={handleTabChange}>Reviews</li>
            <li id="bookAppointment" onClick={handleTabChange}>Book Appointment</li>
            {canGiveReview && <li id="reviewForm" onClick={handleTabChange}>Give Review</li>}
          </ul>
        </div>
      </div>
    </nav>
    {hasError && <div className="error">{error}</div>}
        {data && tab === 'detailTab' && <components.DoctorDetail doctor={data.doctor}/>}
        {data && tab === 'doctorAvailabilityTab' && <components.DoctorAvailability doctorSchedule={data.doctor.schedule} appointmentDuration={data.doctor.appointmentDuration}/>}
        {data && tab === 'reviewTab' && <components.DoctorReviews doctorId={data.doctor._id}/>} 
        {data && tab === 'bookAppointment' && <components.BookAppointment doctor={data.doctor}/>}
        {data && canGiveReview && tab === 'reviewForm' && <components.ReviewForm doctorId={data.doctor._id}/>}
    </div>
  )
}

export default DoctorInfo;