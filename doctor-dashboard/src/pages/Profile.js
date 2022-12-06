import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import {helper} from '../helper';
import arrow from "../assets/images/arrow.svg";

const Profile = () => {
    const [data, setData] = useState('');
    const [fullName, setName] = useState('');
    const [clinicAddress, setClinicAddress] = useState('');
    const [zip, setZip] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async()=>{
            const response = await api.doctor.getDoctor(JSON.parse(localStorage.getItem('id')));
            setName(response.data.name)
            setZip(response.data.zip)
            setClinicAddress(response.data.clinicAddress)
            setData({doctor : response.data});
        }
        if(!data)
        {
            fetchData();
        }
    },[]);

    const handleInputChange = (e) => {
        if(e.target.id === 'profileName')
            setName(e.target.value);
        else if(e.target.id === 'profileZip')
            setZip(e.target.value);
        else if(e.target.id === 'profileClinicAddress')
            setClinicAddress(e.target.value)
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
            const doctorData = {"name":fullName, "zip":zip, clinicAddress: clinicAddress}
            const response = await api.doctor.updateDoctor(data.doctor._id ,doctorData);
            console.log(response);
        }catch(e){
            setHasError(true);
            setError(e.response.data);
            return;
        }
    }
  return (
    <div>
        {data && <components.Navbar doctorId={data.doctor._id}/>}
        {data && <div>
            <form onSubmit={validateSignUp}>
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
            {hasError && <div className="error">{error}</div>}
    </div>
  )
}

export default Profile;