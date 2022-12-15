import React from 'react'

const Prescriptions = (props) => {
  return (
    <div>
        {props.prescriptions.length!==0 ? props.prescriptions.map((prescription, index)=>{
            return <div>
                <span>Disease : </span> <span>{prescription.disease}</span>
                <span>Medicine : </span> <span>{prescription.medicine}</span>
                <span>Document : </span> <span><img style={{height: "100px"}} id="profileImage" src={prescription.document} alt=""/></span>
                <span>Doctor Suggestion : </span> <span>{prescription.doctorSuggestion}</span>
            </div>
        })
      :
      <span>No Prescriptions</span>}
    </div>
  )
}

export default Prescriptions