import React from 'react'

const DoctorDetail = (props) => {
  return (
  <div className="doctorDetail">
    <div  className='container'>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet"></link>
            <form>
                <div className='main-body'>              
                    <div className='row gutters-sm'>
                        <div className='col-md-4 mb-3'>
                            <div className='card'>
                                <div className='card-body'>
                                    <div className='d-flex flex-column align-items-center text-center'>
                                        <img></img>
                                        <h4>{props.doctor.name} </h4>
                                        <p className="text-secondary mb-1">{props.doctor.speciality}</p>
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
                                            <input placeholder="Patrik Hill" id="profileName" value={props.doctor.name} type="text" className="profileInput" autoFocus disabled/>
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
                                            <input placeholder="Patrik Hill" id="profileEmail" value={props.doctor.email}  type="text" className="profileEmail" autoFocus disabled/>
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
                                            <input placeholder="Patrik Hill" id="profileSpeciality" value={props.doctor.speciality}  type="text" className="profileSpeciality" autoFocus disabled/>
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
                                            <input placeholder="Patrik Hill" id="profileClinicAddress" value={props.doctor.clinicAddress}  type="text" className="profileClinicAddress" autoFocus disabled/>
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
                                            <input placeholder="Patrik Hill" id="profileCity" value={props.doctor.city}  type="text" className="profileCity" autoFocus disabled/>
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
                                            <input placeholder="Patrik Hill" id="profileZip" value={props.doctor.zip}  type="text" className="profileZip" autoFocus disabled/>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <div class="row">
                                    <div class="col-sm-3">
                                        <h6 ><label class="mb-0 profileInputText" htmlFor="profileEmail"> Rating : </label></h6>
                                    </div>
                                    <div class="col-sm-9 text-secondary">
                                        <div className="profileInputField">
                                            <input placeholder="Patrik Hill" id="profileRating" value={props.doctor.rating ? props.doctor.rating : "Not Rated Yet"}  type="text" className="profileRating" autoFocus disabled/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            </div>
  </div>
  )
}

export default DoctorDetail;