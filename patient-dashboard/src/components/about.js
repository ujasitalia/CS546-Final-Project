import { api } from '../api';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {helper} from '../helper';

import arrow from "../assets/images/arrow.svg";

export const About = (props) => {
    const [fullName, setName] = useState('');
    const [age, setAge] = useState('');
    const [zip, setZip] = useState('');
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
    useEffect(()=> {
        if(!fullName){
            setName(props.patientData.name);
            //console.log(fullName)
            setAge(props.patientData.age);
            setZip(props.patientData.zip);
        }
    },[])
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
            const data = { "age":helper.common.isValidAge(age), "name": fullName, "zip":zip,"profilePicture":"nopic","city":"Hoboken","state":"New Jersey"}
            const response = await api.profile.patch(props.patientData._id,data);
            console.log(response);
            props.handleChange(response.data);
            setHasError(false);
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
  return (
    <div>
        
       <form onSubmit={validateSignUp}>
            <div className="emailText">
                <label for='aboutName'>Name</label>
                <input placeholder="Patrik Hill" id="aboutName" value={fullName} onChange={handleInputChange} type="text" className="loginInput" autoFocus/>
            </div>
            <br/>
            <div className="emailText">
                <label for='aboutAge'>Age</label>
                <input placeholder="XX years" id="aboutAge" value={age} onChange={handleInputChange} type="number" className="loginInput" />
            </div>
            <br/>
            <div className="emailText">
                <label for='aboutZip'>Zip</label>
                <input placeholder="07307" id="aboutZip" value={zip} onChange={handleInputChange} type="number" className="loginInput" />
            </div>
            <br/>
            <button type="submit" className="loginButton">
                <div className="buttonBox">
                    <img src={arrow} className="arrow" loading="lazy" alt="logo" />
                </div>
            </button>
            {hasError && <div className="error">{error}</div>}
        </form>
    </div>
  )
}
