import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import { About } from '../components/About';
import { Prescriptions } from '../components/Prescriptions';
import { MedicalHistory } from '../components/MedicalHistory';
import { TestReports } from '../components/TestReports';

const Profile = ({patientId}) => {

    const getData = async(patientId) => {
        try{
            const res = await api.profile.get(patientId);
            console.log(res)
            setPatientData(res.data);
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
    useEffect(() => {
        if(!JSON.parse(localStorage.getItem('token_data')))
        {
          navigate("/login");
        }
        if(patientData==='') getData(patientId);
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
        {hasError && <div className="error">{error}</div>}
        <div className="blueContainer">
                    <img src=".dgkjs" className="loginLogo" loading="lazy" alt="logo" />
                    <div className="loginHeading">Patient Login</div>
                    <div className="loginText">Sign In</div>
        </div>
        
        <ul>
            <li onClick={aboutTabClick}>About</li>
            <li onClick={prescriptionsTabClick}>Prescriptions</li>
            <li onClick={medicalHistoryTabClick}>Medical history</li>
            <li onClick={testReportsTabClick}>Test Reports</li>
        </ul>
        
        <div> {patientData && aboutTab && <About patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && prescriptionsTab && <Prescriptions patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && medicalHistoryTab && <MedicalHistory patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && testReportsTab && <TestReports patientData={patientData} handleChange={handlePatientData}/> }</div>        
    </div>
  )
}

export default Profile