import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import arrow from "../assets/images/arrow.svg";
import { helper } from "../helper";
import { specialities } from "../helper/constants";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [npi,setNpi] = useState(''); 
    const [password, setPassword] = useState('');
    const [repassword, setRepassword] = useState('');
    const [fullName, setName] = useState('');
    const [speciality, setSpeciality] = useState('');
    const [zip, setZip] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');
    const [link, setLink] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if(JSON.parse(localStorage.getItem('token_data')))
        {
          navigate("/Dashboard");
        }
      },[]);

    const handleInputChange = (e) => {
        if(e.target.id === 'signUpEmail')
            setEmail(e.target.value); 
        else if(e.target.id === 'signUpNpi')
            setNpi(e.target.value);
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
        else if(e.target.id === 'signUpLink')
            setLink(e.target.value);
    }

    const validateSignUp = async (e) =>{
        e.preventDefault();
        try
        {
            setEmail(helper.common.isValidEmail(email));
            setNpi(helper.common.isValidNpi(npi));
            setPassword(helper.common.isValidPassword(password));
            setRepassword(helper.common.isPasswordSame(repassword,password));
            setSpeciality(helper.common.isValidSpeciality(speciality));
            setName(helper.common.isValidName(fullName));
            setZip(helper.common.isValidZip(zip));
            setClinicAddress(helper.common.isValidAddress(clinicAddress));
            setLink(helper.common.isValidLink(link))
            setHasError(false);
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
                
        try{
            const data = {"email" : email, 'npi':npi, "password" : password, "speciality":speciality, "name":fullName, "zip":zip,"profilePicture":"nopic","clinicAddress":clinicAddress, "link": link}
            const response = await api.signup.post(data);
            localStorage.setItem('token_data', JSON.stringify(response.data.token))
            localStorage.setItem('id',JSON.stringify(response.data.doctorData._id));
            navigate("/dashboard", {doctor : response.data.doctorData});
            setHasError(false);
        }catch(e){
            setHasError(true);
            if(!e.response) setError("Error");
            else setError(e.response.data);
            return;
        }
    }
  return (
    <div>
      
        <div className="loginHeading">Doctor SignUp</div>
        <div id="login-wrap">
            <p> <a href='http://localhost:3006/login'>Login</a> </p>
        </div>
      <div className="loginCard">
        <form onSubmit={validateSignUp}>
            <label htmlFor="signUpEmail">Enter Email</label>
            <input placeholder="username@example.com" id="signUpEmail" value={email} onChange={handleInputChange} type="email" className="loginInput" autoFocus/>
            <br/>
            <label htmlFor="signUpPassword">Enter Password</label>
            <input placeholder="********" id="signUpPassword" value={password} onChange={handleInputChange} type="password" className="loginInput" />
            <br/>
            <label htmlFor="signUpRepassword">Re-enter password</label>
            <input placeholder="********" id="signUpRepassword" value={repassword} onChange={handleInputChange} type="password" className="loginInput" />
            <br/>
            <br/>
            <label htmlFor="signUpNpi">National Provider Identifier (NPI)</label>
            <input placeholder="XXX1234567" id="signUpNpi" value={npi} onChange={handleInputChange} type="text" className="loginInput" />
            <br/>
            <label htmlFor="signUpSpeciality">Choose a Speciality</label>
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
            <label htmlFor="signUpName">Enter Name</label>
            <input placeholder="Patrik Hill" id="signUpName" value={fullName} onChange={handleInputChange} type="text" className="loginInput" />
            <br/>
            <label htmlFor="signUpZip">Enter Zip</label>
            <input placeholder="07307" id="signUpZip" value={zip} onChange={handleInputChange} type="number" className="loginInput" />
            <br/>
            <label htmlFor="signUpClinicAddress">Enter Clinic Address</label>
            <input placeholder="1 Castle point" id="signUpClinicAddress" value={clinicAddress} onChange={handleInputChange} type="text" className="loginInput" />
            <br/>
            <label htmlFor="signUpLink">Enter Zoom meeting link</label>
            <input placeholder="https://us05web.zoom.us/j/4253986951" id="signUpLink" value={link} onChange={handleInputChange} type="text" className="loginInput" />
            <br/>
            <button type="submit" className="loginButton">Sign Up
               
            </button>
        </form>
        {hasError && <div className="error">{error}</div>}
      </div>
    </div>
  );
};

export default SignUp;
