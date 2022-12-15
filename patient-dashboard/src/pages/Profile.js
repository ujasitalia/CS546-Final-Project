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
    const [aboutTab, setAboutTab] = useState(true);
    const [prescriptionsTab, setPrescriptionsTab] = useState(false);
    const [medicalHistoryTab, setMedicalHistoryTab] = useState(false);
    const [testReportsTab, setTestReportsTab] = useState(false);
    const navigate = useNavigate();
    const aboutTabClick = async (e) =>{
        setAboutTab(true);
        setMedicalHistoryTab(false);
        setPrescriptionsTab(false);
        setTestReportsTab(false);
        return
    }
    const medicalHistoryTabClick = async (e) =>{
        setAboutTab(false);
        setMedicalHistoryTab(true);
        setPrescriptionsTab(false);
        setTestReportsTab(false);
        return
    }
    const prescriptionsTabClick = async (e) =>{
        setAboutTab(false);
        setMedicalHistoryTab(false);
        setPrescriptionsTab(true);
        setTestReportsTab(false);
        return
    }
    const testReportsTabClick = async (e) =>{
        setAboutTab(false);
        setMedicalHistoryTab(false);
        setPrescriptionsTab(false);
        setTestReportsTab(true);
        return
    }

    const handlePatientData = (aboutData) => {
        setPatientData(aboutData);
    }
  return (
    <div>
        <components.Navbar/>
        <components.SecondaryNavbar/>
        {hasError && <div className="error">{error}</div>}
        <div className="blueContainer">
                    <img src=".dgkjs" className="loginLogo" loading="lazy" alt="logo" />
                    <div className="loginHeading">Patient Profile</div>
                    <br></br>
        </div>
        
        <ul>
            <li onClick={aboutTabClick}>About</li>
            <li onClick={prescriptionsTabClick}>Prescriptions</li>
            <li onClick={medicalHistoryTabClick}>Medical history</li>
            <li onClick={testReportsTabClick}>Test Reports</li>
        </ul>
        
        <div> {patientData && aboutTab && <components.About patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && prescriptionsTab && <components.Prescriptions patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && medicalHistoryTab && <components.MedicalHistory patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && testReportsTab && <components.TestReports patientData={patientData} handleChange={handlePatientData}/> }</div>        
    </div>
  )
}

export default Profile