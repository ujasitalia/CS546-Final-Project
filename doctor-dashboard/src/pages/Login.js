import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import arrow from "../assets/images/arrow.svg";
import {helper} from '../helper';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        if(e.target.type === 'email')
            setEmail(e.target.value); 
        else
            setPassword(e.target.value);
    }
    const validateLogin = async (e) =>{
        e.preventDefault();
        try
        {
            setEmail(helper.common.isValidEmail(email));
            setPassword(helper.common.isValidPassword(password));
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        
        try{
            const data = {"email" : email, "password" : password}
            const response = await api.login.post(data);
            console.log(response);
            localStorage.setItem('token_data', JSON.stringify(response.data.token));
            localStorage.setItem('id', JSON.stringify(response.data.doctorData._id));
            navigate("/dashboard");
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
                    <div className="loginHeading">Welcome</div>
                    <div className="loginText">Sign In</div>
        </div>
        <div className="loginCard">
        <form onSubmit={validateLogin}>
            <div className="emailText">Enter Email</div>
            <input placeholder="username@example.com" name="email" value={email} onChange={handleInputChange} type="email" className="loginInput" autoFocus/>
            <br/>
            <div className="emailText">Enter Password</div>
            <input placeholder="********" name="password" value={password} onChange={handleInputChange} type="password" className="loginInput" autoFocus/>
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

export default Login
