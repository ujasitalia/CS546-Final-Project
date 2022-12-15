import React from 'react'

const DoctorDetail = (props) => {
  return (
  <div className="doctorDetail">
    <br/>
    <div className="doctorDetailText">Name : {props.doctor.name}</div>
    <div className="doctorDetailText">Email : {props.doctor.email}</div>
    <div className="doctorDetailText">Speciality : {props.doctor.speciality}</div>
    <div className="doctorDetailText">Clinic Address : {props.doctor.clinicAddress}</div>
    <div className="doctorDetailText">Zip : {props.doctor.zip}</div>
    <div className="doctorDetailText">Rating : {props.doctor.rating ? props.doctor.rating : "Not Rated Yet"}</div>
    <br/>
  </div>
  )
}

export default DoctorDetail;
