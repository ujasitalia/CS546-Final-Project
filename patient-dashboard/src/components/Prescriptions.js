import { api } from '../api';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Prescriptions = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState({});
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
    useEffect(() => {
        if(prescriptions==='') getPrescriptions();
    },[])

    const getPrescriptions = async() =>{
      const response = await api.patient.getPatientPrescriptions(JSON.parse(localStorage.getItem('id')));
      setPrescriptions(response.data);
      getDoctors(response.data);
    }
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
            medicineHtml.push(<span>{m} : Dosage - {medicine[m][0]}, {medicine[m][1]} times a day</span>);
        }
        return medicineHtml;
    }

  return (
    <div>
      {hasError && <div className="error">{error}</div>}
        {prescriptions.length === 0 && <p>No prescriptions</p>}
        {prescriptions && prescriptions.map(prescription => {
           return doctors && <div>
            <br/>
            <ul>
                    <li>Doctor - {doctors[prescription.doctorId]}</li>
                    <li>Disease - {prescription.disease}</li>
                    <li>Medicines - {getMedicines(prescription.medicine) }</li>
                    <li>Documents - {prescription.prescriptionDocument? <a download="mydoc.jpg" href={`${prescription.prescriptionDocument}`}>Download Document</a>
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
