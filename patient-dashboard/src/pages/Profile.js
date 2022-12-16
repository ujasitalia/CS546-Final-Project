import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import { components } from '../components';

const Profile = () => {
    useEffect(() => {
        const fetchData = async()=>{
            try{
                const response = await api.profile.get(JSON.parse(localStorage.getItem('id')));
                setPatientData(response.data);
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
          if(!patientData)
          {
            fetchData();
          }
    },[])

    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const [patientData, setPatientData] = useState('');
    const [tab, setTab] = useState('about');
    const navigate = useNavigate();

    const handleTabChange = (e) => {
      setTab(e.target.id); 
    }

    const handlePatientData = (aboutData) => {
        setPatientData(aboutData);
    }
  return (
    <div>
        <components.Navbar/>
        <components.SecondaryNavbar/>
        {hasError && <div className="error">{error}</div>}
        <nav>
          <div className="nav-center">
            <div className="links-container">
              <ul className="links">
                  <li id="about" onClick={handleTabChange}>About</li>
                  <li id="prescriptions" onClick={handleTabChange}>Prescriptions</li>
                  <li id="medicalHistory" onClick={handleTabChange}>Medical history</li>
                  <li id="testReports" onClick={handleTabChange}>Test Reports</li>
              </ul>
            </div>
          </div>
        </nav>
        <div> {patientData && tab==='about' && <components.About patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && tab==='prescriptions' && <components.Prescriptions patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && tab==="medicalHistory" && <components.MedicalHistory patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && tab==="testReports" && <components.TestReports patientData={patientData} handleChange={handlePatientData}/> }</div>        
    </div>
  )
}

export default Profile