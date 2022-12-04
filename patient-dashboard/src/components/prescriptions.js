import { api } from '../api';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {helper} from '../helper';

import arrow from "../assets/images/arrow.svg";


export const Prescriptions = (props) => {

    const getDoctors = async (prescriptions) => {
        try{
            let doctors = {}
            prescriptions.forEach(async(p) => {
                let doctor = await axios.get(`http://localhost:3000/doctor/${p.doctorId}`);
                //console.log(doctor.data)
                doctors[doctor.data._id]=doctor.data.name; 
            })
            setDoctors(doctors);
        }catch(e){
            setHasError(true);
            setError(e);
            return;
        }
    }
    useEffect(() => {
        if(Object.keys(doctors).length===0) getDoctors(props.patientData.prescriptions);
    },[])

    const [doctors, setDoctors] = useState({});
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');

  return (
    <div>
        {props.patientData.prescriptions.forEach(prescription => {
            <div>
                <ul>
                    <li>Doctor - {doctors[prescription.doctorId]}</li>
                    <li>Disease - {prescription.disease}</li>
                    <li>Medicines - {prescription.medicine}</li>
                    <li>Documents - {prescription.documents}</li>
                    <li>Suggestions - {prescription.doctorSuggestion}</li>
                </ul>
            </div> 
        })}
        {hasError && <div className="error">{error}</div>}
    </div>
  )
}
