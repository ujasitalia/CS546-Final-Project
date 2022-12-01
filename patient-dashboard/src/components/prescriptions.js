import { api } from '../api';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {helper} from '../helper';

import arrow from "../assets/images/arrow.svg";

export const Prescriptions = (props) => {
    const [fullName, setName] = useState(props.patientData.name);
    const [age, setAge] = useState(props.patientData.age);
    const [zip, setZip] = useState(props.patientData.zip);
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const handleInputChange = (e) => {
        if(e.target.id === 'aboutAge')
            setAge(e.target.value);
        else if(e.target.id === 'aboutName')
            setName(e.target.value);
        else if(e.target.id === 'aboutZip')
            setZip(e.target.value);
    }
    const validateSignUp = async (e) =>{
        e.preventDefault();
        try
        {
            setAge(helper.common.isValidAge(age));
            setName(helper.common.isValidName(fullName));
            setZip(helper.common.isValidZip(zip));
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        
        try{
            const data = { "age":age, "name": fullName, "zip":zip,"profilePicture":"nopic","city":"Hoboken","state":"New Jersey"}
            const response = await api.profile.patch(props.patientData._id,data);
            console.log(response);
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
  return (
    <div>
       <form onSubmit={validateSignUp}>
            <div className="emailText">Name</div>
            <input placeholder="Patrik Hill" id="aboutName" value={fullName} onChange={handleInputChange} type="text" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Age</div>
            <input placeholder="XX years" id="aboutAge" value={age} onChange={handleInputChange} type="number" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Zip</div>
            <input placeholder="07307" id="aboutZip" value={zip} onChange={handleInputChange} type="number" className="loginInput" autoFocus/>
            <br/>
            <button type="submit" className="loginButton">
                <div className="buttonBox">
                    <img src={arrow} className="arrow" loading="lazy" alt="logo" />
                </div>
            </button>
        </form>
    </div>
  )
}
