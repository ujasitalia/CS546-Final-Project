import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import arrow from "../assets/images/arrow.svg";
import {helper} from '../helper';
import { About } from '../components/About';
import { Prescriptions } from '../components/Prescriptions';
import { MedicalHistory } from '../components/MedicalHistory';

const Profile = ({patientId}) => {

    const getData = async() => {
        try{
            const res = await axios.get(`http://localhost:3000/patient/63720db26efe81c88657130f`);
            console.log(res.data)
            setPatientData(res.data);
        }catch(e){
            setHasError(true);
            setError(e);
            return;
        }
    }
    useEffect(() => {
        if(patientData=='') getData();
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

    const handleAbout = (aboutData) => {
        setPatientData(aboutData);
    }
  return (
    <div>
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
        
        <div> {patientData && aboutTab && <About patientData={patientData} handleChange={handleAbout}/> }</div>
        <div> {patientData && prescriptionsTab && <Prescriptions patientData={patientData}/> }</div>
        <div> {patientData && medicalHistoryTab && <MedicalHistory patientData={patientData}/> }</div>        
        {hasError && <div className="error">{error}</div>}
    </div>
  )
}

export default Profile
