import { api } from '../api';
import React, { useEffect, useState } from 'react';
import {helper} from '../helper';
import { useNavigate } from "react-router-dom";

const Prescriptions = (props) => {
  const navigate = useNavigate();
    useEffect(() => {
        if(Object.keys(doctors).length===0) getDoctors(props.patientData.prescriptions);
    },[])

    const getDoctors = async (prescriptions) => {
        try{
            prescriptions.forEach(async(p) => {
                let doctor = await api.profile.getDoctor(p.doctorId);
                //console.log(doctor.data)
                let x = {};
                x[doctor.data._id] = doctor.data.name
                setDoctors({...doctors, ...x})
            })
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
      {hasError && <div className="error">{error}</div>}
        {props.patientData.prescriptions && <p>No prescriptions</p>}
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
                    <li>Documents - {prescription.documents? <a download="mydoc.jpg" href={`${prescription.documents}`}>Download Document</a>
                        :
                        <span>No Document</span>}</li>
                    <li>Suggestions - {prescription.doctorSuggestion}</li>
                </ul>
            </div> 
            
        })}
    </div>
  )
}

export default Prescriptions
