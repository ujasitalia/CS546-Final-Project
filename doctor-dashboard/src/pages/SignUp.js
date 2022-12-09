import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import arrow from "../assets/images/arrow.svg";
import {helper} from '../helper';
import {specialities} from '../helper/constants'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [fullName, setName] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [zip, setZip] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        if(e.target.id === 'signUpEmail')
            setEmail(e.target.value); 
        else if(e.target.id === 'signUpPassword')
            setPassword(e.target.value);
        else if(e.target.id === 'signUpRepassword')
            setRepassword(e.target.value);
        else if(e.target.id === 'signUpSpeciality')
            setSpeciality(e.target.value);
        else if(e.target.id === 'signUpName')
            setName(e.target.value);
        else if(e.target.id === 'signUpZip')
            setZip(e.target.value);
        else if(e.target.id === 'signUpClinicAddress')
            setClinicAddress(e.target.value);
    }
    const validateSignUp = async (e) =>{
        e.preventDefault();
        try
        {
            setEmail(helper.common.isValidEmail(email));
            setPassword(helper.common.isValidPassword(password));
            setRepassword(helper.common.isPasswordSame(repassword,password));
            setSpeciality(helper.common.isValidSpeciality(speciality));
            setName(helper.common.isValidName(fullName));
            setZip(helper.common.isValidZip(zip));
            setClinicAddress(helper.common.isValidAddress(clinicAddress));
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        
        try{
            const data = {"email" : email, "password" : password, "speciality":speciality, "name":fullName, "zip":zip,"profilePicture":"nopic","city":"Hoboken","state":"New Jersey","clinicAddress":clinicAddress}
            const response = await api.signup.post(data);
            console.log(response);
            localStorage.setItem('token_data', JSON.stringify(response.data.token))
            navigate("/dashboard", {doctor : response.data.doctorData});
        }catch(e){
            setHasError(true);
            if(!e.response) setError("Error");
            else setError(e.response.data);
            return;
        }
    }
  return (
    <div>
        <div className="blueContainer">
                    <img src=".dgkjs" className="loginLogo" loading="lazy" alt="logo" />
                    <div className="loginHeading">Doctor SignUp</div>
                    <div className="loginText">Sign Up</div>
        </div>
        <div className="loginCard">
        <form onSubmit={validateSignUp}>
            <div className="emailText">Enter Email</div>
            <input placeholder="username@example.com" id="signUpEmail" value={email} onChange={handleInputChange} type="email" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Enter Password</div>
            <input placeholder="********" id="signUpPassword" value={password} onChange={handleInputChange} type="password" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Re-Enter Password</div>
            <input placeholder="********" id="signUpRepassword" value={repassword} onChange={handleInputChange} type="password" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Enter Speciality</div>
            {/* <input placeholder="Cardiologist" id="signUpSpeciality" value={speciality} onChange={handleInputChange} type="text" className="loginInput" autoFocus/> */}
            <select id="signUpSpeciality" value={speciality} onChange={handleInputChange}>
                <option value="">--Choose a Speciality--</option>
                {
                    specialities.map(spec => {
                        return <option value={spec}>{spec}</option>;
                    //   return spec===speciality ? <option value={spec} selected>{spec}</option> : <option value={spec}>{spec}</option>
                    })
                }
            </select>
            <br/>
            <div className="emailText">Enter name</div>
            <input placeholder="Patrik Hill" id="signUpName" value={fullName} onChange={handleInputChange} type="text" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Enter zip</div>
            <input placeholder="07307" id="signUpZip" value={zip} onChange={handleInputChange} type="number" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Enter Clinic Address</div>
            <input placeholder="1 Castle point" id="signUpClinicAddress" value={clinicAddress} onChange={handleInputChange} type="text" className="loginInput" autoFocus/>
            <br/>
            <button type="submit" className="loginButton">
                <div className="buttonBox">
                    <img src={arrow} className="arrow" loading="lazy" alt="logo" />
                </div>
            </button>
        </form>
        {hasError && <div className="error">{error}</div>}
        </div>
    </div>
  )
}

export default SignUp
