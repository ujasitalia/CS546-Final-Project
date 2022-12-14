import axios from 'axios';
import React, { Component, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import arrow from "../assets/images/arrow.svg";
import {helper} from '../helper';
import { About } from '../components/About';
import { Prescriptions } from '../components/Prescriptions';
import { MedicalHistory } from '../components/MedicalHistory';
import { TestReports } from '../components/TestReports';
import { axiosAuth } from '../api/axios';
import { components } from '../components';

const Profile = () => {
    useEffect(() => {
        const fetchData = async()=>{
            try{
                const response = await api.profile.get(JSON.parse(localStorage.getItem('id')));
                setPatientData(response.data);
            }catch(e){
                setHasError(true);
                setError(e);
                return;
            }
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
        
        <div> {patientData && aboutTab && <About patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && prescriptionsTab && <Prescriptions patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && medicalHistoryTab && <MedicalHistory patientData={patientData} handleChange={handlePatientData}/> }</div>
        <div> {patientData && testReportsTab && <TestReports patientData={patientData} handleChange={handlePatientData}/> }</div>        
        {hasError && <div className="error">{error}</div>}
    </div>
  )
}

export default Profile
