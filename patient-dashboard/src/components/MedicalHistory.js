import { api } from '../api';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {helper} from '../helper';


import arrow from "../assets/images/arrow.svg";
import { isValidMedicalHistory } from '../helper/common';

export const MedicalHistory = (props) => {
    const [medicalHistory, setMedicalHistory] = useState(props.patientData.medicalHistory);
    const [medicalHistoryId,setMedicalHistoryId] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const handleInputChange = (e) => {
        let field = e.target.id.split('-');
        let newMedicalHistory = [...medicalHistory]
        if(field[2] == 'disease')
            newMedicalHistory[field[1]]['disease']=e.target.value;
        else if(field[2] === 'startDate')
            newMedicalHistory[field[1]]['startDate']=e.target.value;
        else if(field[2] === 'endDate')
            newMedicalHistory[field[1]]['endDate']=e.target.value;

        setMedicalHistory(newMedicalHistory);
    }
    const getTodaysDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
    }
    const processDate = (date) => {
        if(date)
        {
        var today = new Date(date);
        var dd = String(today.getDate()+1).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;
        return today;
        }
    }
    const validateSignUp = async (e) =>{
        e.preventDefault();
        try
        {
            setMedicalHistory(isValidMedicalHistory(medicalHistory));
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        
        try{
            const data = { 'medicalHistory':medicalHistory }
            const response = await api.profile.patchMedicalHistory(props.patientData._id,data,e.target.id);
            //props.handleChange();
            console.log(response);
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
  return (
    <div>
        
        {
        props.patientData.medicalHistory.map((disease,index) => {
            return medicalHistory && 
            <form onSubmit={validateSignUp} id={disease.medicalHistoryId}>
                <div>
                    <div>
                        <label for={disease.medicalHistoryId+'-'+index+'-disease'}>Disease</label>
                        <input placeholder="Disease" id={disease.medicalHistoryId+'-'+index+'-disease'} value={medicalHistory[index]['disease']} onChange={handleInputChange} type="text" className="disease"/>
                    </div>
                    <div>
                        <label for={disease.medicalHistoryId+'-'+index+'-startDate'}>Start Date</label>
                        <input placeholder="Start Date" id={disease.medicalHistoryId+'-'+index+'-startDate'} value={processDate(medicalHistory[index]['startDate'])} onChange={handleInputChange} type="date" className="startDate" max={getTodaysDate()}/>
                    </div>
                    <div>
                        <label for={disease.medicalHistoryId+'-'+index+'-endDate'}>End Date</label>
                        <input placeholder="End Date" id={disease.medicalHistoryId+'-'+index+'-endDate'} value={processDate(medicalHistory[index]['endDate'])} onChange={handleInputChange} type="date" className="endDate" min={medicalHistory[index]['startDate']} max={getTodaysDate()}/>
                    </div>
                    <button type="submit" className="loginButton">
                        <div className="buttonBox">
                            <img src={arrow} className="arrow" loading="lazy" alt="logo" />
                        </div>
                    </button>
                </div>
            </form>
       })}
        {hasError && <div className="error">{error}</div>}
    </div>
  )
}
