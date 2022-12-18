import React from 'react'

export const DoctorAvailability = (props) => {
  const getAvailability = () =>{
    let daycard = [];
   for(let day in props.doctorSchedule)
   {
      daycard.push(
        <div  className="col-sm-4" key={day}>
        <br/>
          <h3>{day} :</h3> {props.doctorSchedule[day].map((element, index)=>{
            return (<div key={index}>{element[0]} - {element[1]}</div>)
          })}
        </div>
      )
   }
   return daycard;
  }
  return (
    <div>
      <div>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
          integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" 
          crossOrigin="anonymous"></link>
          <div  className="container-fluid pt-4 px-4">
              <div  className="row g-4">
                  <div  className="col-sm-12 col-xl-12">
                      <div  className="bg-light rounded h-100 p-4">
                        <div>
                          <h1>Appointment Duration : {props.appointmentDuration}</h1>
                          <h2>Schedule</h2>
                        </div>
                        <div className='row w-100 '>
                          {getAvailability()}
                        </div>
                      </div>
                  </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default DoctorAvailability;