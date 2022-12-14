import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import {helper} from '../helper';
import arrow from "../assets/images/arrow.svg";
import "../assets/css/profile.css";

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
    <>
    <div>
        
        {data && <components.Navbar doctorId={data.doctor._id}/>}
        {data && <div  className='container'>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <form onSubmit={validateSignUp}>
                <div className='main-body'>              
                    <div className='row gutters-sm'>
                        <div className='col-md-4 mb-3'>
                            <div className='card'>
                                <div className='card-body'>
                                    <div className='d-flex flex-column align-items-center text-center'>
                                        <img></img>
                                        <h4>{fullName}</h4>
                                        <p className="text-secondary mb-1">{data.doctor.speciality}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-8'>
                            <div className='card mb-3'>
                                <div class="row">
                                    <div class="col-sm-3 profilelabel">
                                        <h6><label class="mb-0 profileInputText" htmlFor="profileName"> Name : </label></h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <div className="profileInputField">
                                            <input placeholder="Patrik Hill" id="profileName" value={fullName} onChange={handleInputChange} type="text" className="profileInput" autoFocus disabled/>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 ><label class="mb-0 profileInputText" htmlFor="profileSpeciality"> Speciality : </label></h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <div className="profileInputField">
                                            <input placeholder="Patrik Hill" id="profileSpeciality" value={data.doctor.speciality} onChange={handleInputChange} type="text" className="profileSpeciality" autoFocus />
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 ><label class="mb-0 profileInputText" htmlFor="profileClinicAddress"> Clinic Address : </label></h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <div className="profileInputField">
                                            <input placeholder="Patrik Hill" id="profileClinicAddress" value={clinicAddress} onChange={handleInputChange} type="text" className="profileClinicAddress" autoFocus/>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 ><label class="mb-0 profileInputText" htmlFor="profileCity"> City : </label></h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <div className="profileInputField">
                                            <input placeholder="Patrik Hill" id="profileCity" value={data.doctor.city} onChange={handleInputChange} type="text" className="profileCity" autoFocus disabled/>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 ><label class="mb-0 profileInputText" htmlFor="profileZip"> Zipcode : </label></h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <div className="profileInputField">
                                            <input placeholder="Patrik Hill" id="profileZip" value={zip} onChange={handleInputChange} type="text" className="profileZip" autoFocus/>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 ><label class="mb-0 profileInputText" htmlFor="profileEmail"> Email : </label></h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <div className="profileInputField">
                                            <input placeholder="Patrik Hill" id="profileEmail" value={data.doctor.email} onChange={handleInputChange} type="text" className="profileEmail" autoFocus disabled/>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-12">   
                                        <button type="submit" className="updateProfileButton">
                                            <div className="buttonBox">
                                                <a class="btn btn-info " target="__blank" href="https://www.bootdey.com/snippets/view/profile-edit-data-and-skills">Edit</a>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            </div>}
            {hasError && <div className="error">{error}</div>}
    </div>
    </>
  )
}

export default Profile;
