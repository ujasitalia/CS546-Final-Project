import { api } from '../api';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { isValidMedicalHistory } from '../helper/common';

const MedicalHistory = (props) => {
    const [medicalHistory, setMedicalHistory] = useState(props.patientData.medicalHistory);
    const [medicalHistoryId,setMedicalHistoryId] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const [inputMedicalHistory,setInputMedicalHistory] = useState(false);
    const navigate = useNavigate();
    
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
    // const processDate = (date) => {
    //     if(date)
    //     {
    //     var today = new Date(date);
    //     var dd = String(today.getDate()).padStart(2, '0');
    //     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //     var yyyy = today.getFullYear();

    //     today = yyyy + '-' + mm + '-' + dd;
    //     return today;
    //     }
    // }
    const addMedicalHistory = async () => {

        setInputMedicalHistory(!inputMedicalHistory);
        if(!inputMedicalHistory){
            let medicalHistoryForm = {
            'disease':'',
            'startDate':'',
            'endDate':''
            }
            let newMedicalHistory = [medicalHistoryForm,...medicalHistory];
            setMedicalHistory(newMedicalHistory);
        }
        else{
            let newMedicalHistory = [...medicalHistory];
            newMedicalHistory.splice(0,1);
            setMedicalHistory(newMedicalHistory);
        }
    }
    const validateSignUp = async (e) =>{
        e.preventDefault();
        let newMedicalHistory;
        try
        {
            newMedicalHistory = isValidMedicalHistory(medicalHistory);
            setMedicalHistory(newMedicalHistory);
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        if(inputMedicalHistory){
            try{
                let data=newMedicalHistory[0];
                
                const response = await api.profile.addMedicalHistory(props.patientData._id,data);
                //props.handleChange();
                // console.log(response);
                
                props.handleChange(response.data);
                setMedicalHistory(response.data.medicalHistory)
                setHasError(false);
                setInputMedicalHistory(false);
            }catch(e){
                setHasError(true);
                setError(e.response.data);
                return;
            }
        }
        else{

            try{
                let data={};
                for(let m of newMedicalHistory){
                    if(m['medicalHistoryId']==e.target.id) data = m;
                }
                const response = await api.profile.patchMedicalHistory(props.patientData._id,data,e.target.id);
                //props.handleChange();
                // console.log(response);
                
                // props.handleChange(response.data);
                setHasError(false);
                setInputMedicalHistory(false);
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
    }
  return (
    <div>
        {hasError && <div className="error">{error}</div>}
        {!inputMedicalHistory && <button onClick={addMedicalHistory}>Add Medical history</button>}
        {inputMedicalHistory && <button onClick={addMedicalHistory}>Cancel</button>}
        {medicalHistory && medicalHistory.map((disease,index) => {
            return <form onSubmit={validateSignUp} id={disease.medicalHistoryId}>
                <div>
                    <div>
                        <label htmlFor={disease.medicalHistoryId+'-'+index+'-disease'}>Disease</label>
                        <input placeholder="Disease" id={disease.medicalHistoryId+'-'+index+'-disease'} value={medicalHistory[index]['disease']} onChange={handleInputChange} type="text" className="disease"/>
                    </div>
                    <div>
                        <label htmlFor={disease.medicalHistoryId+'-'+index+'-startDate'}>Start Date</label>
                        <input placeholder="Start Date" id={disease.medicalHistoryId+'-'+index+'-startDate'} value={medicalHistory[index]['startDate'] } onChange={handleInputChange} type="date" className="startDate" max={getTodaysDate()}/>
                    </div>
                    <div>
                        <label htmlFor={disease.medicalHistoryId+'-'+index+'-endDate'}>End Date</label>
                        <input placeholder="End Date" id={disease.medicalHistoryId+'-'+index+'-endDate'} value={medicalHistory[index]['endDate'] } onChange={handleInputChange} type="date" className="endDate" min={medicalHistory[index]['startDate']} max={getTodaysDate()}/>
                    </div>
                    <button type="submit" className="loginButton">Submit</button>
                </div>
            </form>
       })}
    </div>
  )
}

export default MedicalHistory;