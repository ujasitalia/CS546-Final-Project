import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import {helper} from '../helper';
import arrow from "../assets/images/arrow.svg";
import "../assets/css/profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [data, setData] = useState('');
    const [fullName, setName] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');
    const [zip, setZip] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async()=>{
            try{
                const response = await api.doctor.getDoctor(JSON.parse(localStorage.getItem('id')));
                setName(response.data.name)
                setZip(response.data.zip)
                setClinicAddress(response.data.clinicAddress)
                setProfilePicture(response.data.profilePicture)
                setData({doctor : response.data});
                setHasError(false);
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
        if(!JSON.parse(localStorage.getItem('token_data')))
        {
          navigate("/login");
        }
        if(!data)
        {
            fetchData();
        }
    },[]);

    const getBase64 = async(file) => {

          let baseURL = "";
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            baseURL = reader.result;
            setProfilePicture(baseURL);
          };
      };

    const handleInputChange = async(e) => {
        if(e.target.id === 'profileName')
            setName(e.target.value);
        else if(e.target.id === 'profileZip')
            setZip(e.target.value);
        else if(e.target.id === 'profileClinicAddress')
            setClinicAddress(e.target.value)
        else if(e.target.id = 'updatedProfileImage')
        {
            if(e.target.files[0].size > 12097152){
                alert("huge file");
            }else
            {
                getBase64(e.target.files[0]);
            }
        }
    }
    const validateSignUp = async (e) =>{
        e.preventDefault();
        try
        {
            setName(helper.common.isValidName(fullName));
            setZip(helper.common.isValidZip(zip));
            setClinicAddress(helper.common.isValidAddress(clinicAddress));
        }catch(e){
            setHasError(true);
            setError(e.message);
            return;
        }
        
        try{
            if(profilePicture!==data.doctor.profileImage || fullName!==data.doctor.name || zip!==data.doctor.zip || clinicAddress!==data.doctor.clinicAddress)
            {
                const doctorData = {"name":fullName, "zip":zip, clinicAddress: clinicAddress, profilePicture:profilePicture}
                const response = await api.doctor.updateDoctor(data.doctor._id ,doctorData);
                setData({doctor : response.data});
                setHasError(false);
            }
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
    <>
    <div>
        
        {data && <components.Navbar doctorId={data.doctor._id}/>}
        {hasError && <div className="error">{error}</div>}
        {data && <div  className='container'>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <form onSubmit={validateSignUp}>
                <div className="profileInputField">
                    <label className="profileInputText" htmlFor="profileImage"> Profile Image : </label> 
                    <img style={{height: "100px"}} id="profileImage" src={`${data.doctor.profilePicture}`} alt=""/>
                    <a download="myImage.gif" href={`${data.doctor.profilePicture}`}>Download Profile</a>
                    <input type="file" id='updatedProfileImage' onChange={handleInputChange} />
                </div>
                <br/>
                <div className="profileInputField"><label className="profileInputText" htmlFor="profileEmail"> Email : </label> <span id="profileEmail">{data.doctor.email}</span> </div>
                <br/>
                <div className="profileInputField"> <label className="profileInputText" htmlFor="profileSpeciality"> Speciality : </label> <span id="profileSpeciality">{data.doctor.speciality}</span> </div>
                <br/>
                <div className="profileInputField"> <label className="profileInputText" htmlFor="profileName"> Name : </label> <input placeholder="Patrik Hill" id="profileName" value={fullName} onChange={handleInputChange} type="text" className="profileInput" autoFocus/></div>
                <br/>
                <div className="profileInputField"> <label className="profileInputText" htmlFor="profileClinicAddress">  Clinic Address : </label> <input placeholder="125 cambridge ave, jersey city" id="profileClinicAddress" value={clinicAddress} onChange={handleInputChange} type="text" className="profileInput" autoFocus/></div>
                <br/>
                <div className="profileInputField"> <label className="profileInputText" htmlFor="profileZip"> Zip : </label> <input placeholder="07307" id="profileZip" value={zip} onChange={handleInputChange} type="number" className="profileInput" autoFocus/></div>
                <br/>
                <button type="submit" className="updateProfileButton">
                    <div className="buttonBox">
                        <img src={arrow} className="arrow" loading="lazy" alt="logo" />
                    </div>
                </button>
            </form>
            </div>}
    </div>
    </>
  )
}

export default Profile;
