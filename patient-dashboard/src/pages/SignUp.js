import React, { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
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
    useEffect(() => {
        if(JSON.parse(localStorage.getItem('token_data')))
        {
          navigate("/Dashboard");
        }
      },[]);
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
    <div>
        <div className="blueContainer">
                    <div className="loginHeading">Patient SignUp</div>
        </div>
        <div id="login-account-wrap">
            <p> <a href='http://localhost:3003/login'>Login</a> </p>
        </div>
        <div className="loginCard">
        <form onSubmit={validateSignUp}>
            <label htmlFor='signUpEmail'>Enter Email</label>
            <input placeholder="username@example.com" id="signUpEmail" value={email} onChange={handleInputChange} type="email" className="loginInput" autoFocus/>
            <br/>
            <label htmlFor='signUpPassword'>Enter Password</label>
            <input placeholder="********" id="signUpPassword" value={password} onChange={handleInputChange} type="password" className="loginInput" autoFocus/>
            <br/>
            <label htmlFor='signUpRepassword'>Re-Enter Password</label>
            <input placeholder="********" id="signUpRepassword" value={repassword} onChange={handleInputChange} type="password" className="loginInput" autoFocus/>
            <br/>
            <label htmlFor='signUpAge'>Enter Age</label>
            <input placeholder="XX years" id="signUpAge" value={age} onChange={handleInputChange} type="number" className="loginInput" autoFocus/>
            <br/>
            <label htmlFor='signUpName'>Enter name</label>
            <input placeholder="Patrik Hill" id="signUpName" value={fullName} onChange={handleInputChange} type="text" className="loginInput" autoFocus/>
            <br/>
            <label htmlFor='signUpZip'>Enter zip</label>
            <input placeholder="07307" id="signUpZip" value={zip} onChange={handleInputChange} type="number" className="loginInput" autoFocus/>
            <br/>
            <button type="submit" className="loginButton">Sign Up</button>
        </form>
        {hasError && <div className="error">{error}</div>}
        </div>
    </div>
  )
}

export default SignUp
