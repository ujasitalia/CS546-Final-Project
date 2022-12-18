import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import {helper} from '../helper';
import "../assets/css/login.css";
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
    useEffect(() => {
        if(JSON.parse(localStorage.getItem('token_data')))
        {
          navigate("/Dashboard");
        }
      },[]);
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
            localStorage.setItem('token_data', JSON.stringify(response.data.token));
            localStorage.setItem('id',JSON.stringify(response.data.patientData._id));
            navigate("/dashboard", {patient : response.data.patientData});
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
  return (
    <div className='loginPage'>
        <div className="loginCard" id="login-form-wrap">    
        <h1>Login</h1>
        <form onSubmit={validateLogin} id="login-form">
            <p>
                <label htmlFor='loginEmail'>Email</label>
                <input id='loginEmail' placeholder="Enter Email" name="email" value={email} onChange={handleInputChange} type="email"  className="loginInput" autoFocus/>
                <br/>                
            </p>
            <p>
                <label htmlFor='loginPassword'>Password</label>
                <input id='loginPassword' placeholder="Enter Password" name="password" value={password} onChange={handleInputChange} type="password" className="loginInput" autoFocus/>
                <br/>
            </p>
            <p>
                <input type="submit" id="login" value="Login" className="loginButton"/>
            </p>
        </form>
        <div id="create-account-wrap">
            <p> <a href='http://localhost:3003/signup'>Sign up</a> </p>
        </div>
        {hasError && <div className="error">{error}</div>}
        </div>
    </div>
  )
}

export default Login
