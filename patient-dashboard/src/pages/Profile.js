import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';

const Profile = () => {
    const [data, setData] = useState('');
    useEffect(() => {
      const fetchData = async()=>{
        const response = await api.patient.getPatientAppointments();
        setData({appointments : response.data});
      }
      if(!data)
      {
        fetchData();
      }
    },[]);

    return(<>
    <div>
        {data && data}<components.Navbar/>
        {data && data}<div  className='container'>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <form onSubmit="{validateSignUp}">
                <div className='main-body'>              
                    <div className='row gutters-sm'>
                        <div className='col-md-4 mb-3'>
                            <div className='card'>
                                <div className='card-body'>
                                    <div className='d-flex flex-column align-items-center text-center'>
                                        <img></img>
                                        <h4>fullName</h4>
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
                                            <input placeholder="Patrik Hill" id="profileName" value="{fullName}" onChange="{handleInputChange}" type="text" className="profileInput" autoFocus/>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <hr />
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 ><label class="mb-0 profileInputText" htmlFor="profileClinicAddress"> Address : </label></h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <div className="profileInputField">
                                            <input placeholder="Patrik Hill" id="profileClinicAddress" value="{clinicAddress} "onChange="{handleInputChange}" type="text" className="profileClinicAddress" autoFocus/>
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
                                            <input placeholder="Patrik Hill" id="profileCity" value="{data.doctor.city}" onChange="{handleInputChange}" type="text" className="profileCity" autoFocus/>
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
                                            <input placeholder="Patrik Hill" id="profileZip" value="{zip}" onChange="{handleInputChange}" type="text" className="profileZip" autoFocus/>
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
                                            <input placeholder="Patrik Hill" id="profileEmail" value="{data.doctor.email} "onChange="{handleInputChange}" type="text" className="profileEmail" autoFocus/>
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
            </div>
    </div></>
    )
}

export default Profile;