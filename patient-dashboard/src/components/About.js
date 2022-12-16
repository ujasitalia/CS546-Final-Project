import { api } from '../api';
import React, { useEffect, useState } from 'react';
import {helper} from '../helper';
import { useNavigate } from "react-router-dom";

const About = (props) => {
    const [fullName, setName] = useState('');
    const [age, setAge] = useState('');
    const [zip, setZip] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [hasError, setHasError] = useState(false);
    const [hasSuccessMessage, setHasSuccessMessage] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const getBase64 = async(file) => {

        let baseURL = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          baseURL = reader.result;
          setProfilePicture(baseURL);
        };
    };

    const handleInputChange = (e) => {
        if(hasSuccessMessage)
            setHasSuccessMessage(false);
        if(hasError)
            setError(false);
        if(e.target.id === 'aboutAge')
            setAge(e.target.value);
        else if(e.target.id === 'aboutName')
            setName(e.target.value);
        else if(e.target.id === 'aboutZip')
            setZip(e.target.value);
        else if(e.target.id === 'updatedProfileImage')
        {
            if(e.target.files[0].size > 12097152){
                alert("huge file");
            }else
            {
                getBase64(e.target.files[0]);
            }
        }
    }

    useEffect(()=> {
        if(!fullName){
            setName(props.patientData.name);
            //console.log(fullName)
            setProfilePicture(props.patientData.profilePicture)
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
            const data = { "age":helper.common.isValidAge(age), "name": helper.common.isValidName(fullName), "zip":helper.common.isValidZip(zip)}
            if(profilePicture!='')
                data["profilePicture"] = profilePicture
            const response = await api.profile.patch(props.patientData._id,data);
            console.log(response);
            props.handleChange(response.data);
            setHasError(false);
            setHasSuccessMessage(true);
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
  return (
    <div>
        {hasError && <div className="error">{error}</div>}
        {hasSuccessMessage && <div className='successMessage'>Successfully updated</div>}
       <form onSubmit={validateSignUp}>
            <label className="profileInputText" htmlFor="profileImage"> Profile Image : </label> 
                    {props.patientData.profilePicture ? <><img style={{height: "100px"}} id="profileImage" src={`${props.patientData.profilePicture}`} alt=""/>
                    <a download="myImage.gif" href={`${props.patientData.profilePicture}`}>Download Profile</a></>
                    :
                    <span>No Profile</span>}
                <input type="file" id='updatedProfileImage' onChange={handleInputChange} />
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
            <button type="submit" className="loginButton">Submit</button>
        </form>
    </div>
  )
}

export default About;
