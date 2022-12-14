import React from 'react'

export const DoctorAvailability = (props) => {
  const getAvailability = () =>{
    let daycard = [];
   for(let day in props.doctorSchedule)
   {
      daycard.push(
        <div class="col-sm-4">
        <br/>
          <h6>{day} :</h6> {props.doctorSchedule[day].map((element)=>{
            return (<div>{element[0]} - {element[1]}</div>)
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
          crossorigin="anonymous"></link>
          <div class="container-fluid pt-4 px-4">
              <div class="row g-4">
                  <div class="col-sm-12 col-xl-12">
                      <div class="bg-light rounded h-100 p-4">
                        <div>
                          <h4>Appointment Duration : {props.appointmentDuration}
                          <br/>
                          Schedule</h4>
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