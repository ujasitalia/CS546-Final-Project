import React from 'react'

const MedicalHistory = (props) => {
  return (
    <div>
        {props.medicalHistory.length !== 0 ? props.medicalHistory.map((medical, index)=>{
            return <div>
                <br/>
                <div><span>Disease : </span> <span>{medical.disease}</span></div>
                <div><span>Start Date : </span> <span>{medical.startDate}</span></div>
                {medical.endDate &&<div><span>End Date : </span> <span>{medical.endDate}</span></div>}
            </div>
        })
      :
      <span>No Medical History</span>}
    </div>
  )
}

export default MedicalHistory