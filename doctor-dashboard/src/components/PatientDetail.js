import React from 'react'

const PatientDetail = (props) => {
  return (
    <div className="doctorDetail">
    <br/>
    <div className="doctorDetailText">Name : {props.doctor.name}</div>
    <div className="doctorDetailText">Email : {props.doctor.email}</div>
    <div className="doctorDetailText">Clinic Address : {props.doctor.age}</div>
    <div className="doctorDetailText">Zip : {props.doctor.zip}</div>
    <br/>
  </div>
  )
}

export default PatientDetail;