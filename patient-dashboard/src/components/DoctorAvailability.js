import React from 'react'

export const DoctorAvailability = (props) => {
  const getAvailability = () =>{
    let daycard = [];
   for(let day in props.doctorSchedule)
   {
      daycard.push(
        <div>
        <br/>
          {day} : {props.doctorSchedule[day].map((element)=>{
            return (<div>{element[0]} - {element[1]}</div>)
          })}
        </div>
      )
   }
   return daycard;
  }
  return (
    <div>
      <br/>
      Appointment Duration : {props.appointmentDuration}
      <br/>
      <br/>
      Schedule
      {getAvailability()}
    </div>
  )
}

export default DoctorAvailability;