import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import arrow from "../assets/images/arrow.svg";
import {helper} from '../helper';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [fullName, setName] = useState('');
    const [age, setAge] = useState('');
    const [zip, setZip] = useState('');
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
        else if(e.target.id === 'signUpAge')
            setAge(e.target.value);
        else if(e.target.id === 'signUpName')
            setName(e.target.value);
        else if(e.target.id === 'signUpZip')
            setZip(e.target.value);
    }
    const validateSignUp = async (e) =>{
        e.preventDefault();
        try
        {
            setEmail(helper.common.isValidEmail(email));
            setPassword(helper.common.isValidPassword(password));
            setRepassword(helper.common.isPasswordSame(repassword,password));
            setAge(helper.common.isValidAge(age));
            setName(helper.common.isValidName(fullName));
            setZip(helper.common.isValidZip(zip));
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        
        try{
            const data = {"email" : email, "password" : password, "age":age, "name":fullName, "zip":zip,"profilePicture":"nopic"}
            const response = await api.signup.post(data);
            console.log(response);
            localStorage.setItem('token_data', JSON.stringify(response.data.token))
            navigate("/dashboard", {patient : response.data.patientData});
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
  return (
    <div>
        <div className="blueContainer">
                    <img src=".dgkjs" className="loginLogo" loading="lazy" alt="logo" />
                    <div className="loginHeading">Patient SignUp</div>
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
            <div className="emailText">Enter Age</div>
            <input placeholder="XX years" id="signUpAge" value={age} onChange={handleInputChange} type="number" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Enter name</div>
            <input placeholder="Patrik Hill" id="signUpName" value={fullName} onChange={handleInputChange} type="text" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Enter zip</div>
            <input placeholder="07307" id="signUpZip" value={zip} onChange={handleInputChange} type="number" className="loginInput" autoFocus/>
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
