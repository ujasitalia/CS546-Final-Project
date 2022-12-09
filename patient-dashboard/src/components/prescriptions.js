import { api } from '../api';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {helper} from '../helper';

import arrow from "../assets/images/arrow.svg";


export const Prescriptions = (props) => {
    useEffect(() => {
        if(Object.keys(doctors).length===0) getDoctors(props.patientData.prescriptions);
    },[])

    const getDoctors = async (prescriptions) => {
        try{
            prescriptions.forEach(async(p) => {
                let doctor = await axios.get(`http://localhost:3000/doctor/${p.doctorId}`);
                //console.log(doctor.data)
                let x = {};
                x[doctor.data._id] = doctor.data.name
                setDoctors({...doctors, ...x})
            })
        }catch(e){
            setHasError(true);
            setError(e);
            return;
        }
    }
   
    const getMedicines = (medicine) => {
        let medicineHtml = [];
        for(let m in medicine){
            medicineHtml.push(<li>{m} : Dosage - {medicine[m][0]}, {medicine[m][1]} times a day</li>);
        }
        return medicineHtml;
    }

    const [doctors, setDoctors] = useState({});
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');

  return (
    <div>
        {props.patientData.prescriptions.map(prescription => {
           return doctors && <div>
            <ul>
                    <li>Doctor - {doctors[prescription.doctorId]}</li>
                    <li>Disease - {prescription.disease}</li>
                    <li>Medicines - 
                        <ul>
                        {getMedicines(prescription.medicine) }
                        </ul>
                    </li>
                    <li>Documents - {prescription.documents}</li>
                    <li>Suggestions - {prescription.doctorSuggestion}</li>
                </ul>
            </div> 
            
        })}
        {hasError && <div className="error">{error}</div>}
    </div>
  )
}
