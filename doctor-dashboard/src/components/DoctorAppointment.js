import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const DoctorAppointment = (props) => {
  const [appointments, setAppointments] = useState("");
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fetchData = async () => {
    try{
      const response = await api.appointment.getDoctorAppointment(props.doctorId);
      setAppointments(response.data);
      setHasError(false);
    }catch(e){
      if(e.response.status===500)
        navigate("/error");
      else if(e.response.status===401 )
      {
        localStorage.clear();
        navigate("/login");
      }else{
        setHasError(true);
        setError(e.response.data);
      }
    }
  };
  useEffect(() => {
    if (appointments === "") fetchData();
  }, []);
  return (
    <div>
      {hasError && <div className="error">{error}</div>}
      {appointments !== '' 
      ? <div className="appointmentContainer">
          <div>{appointments.length !== 0 ? appointments.map((element, index) =>
            <Link to={`/dashboard/appointment/${element._id}`} state={{appointmentId :      element._id}}>
                <div className="card" key={element._id}>
                    <div className="cardHeading">Appointment - {index+1}</div>
                    <div className="cardText">Date : {element.startTime.slice(0, 10)}</div>
                    <div className="cardText">Time : {element.startTime.slice(11,19)}</div>
                </div>
            </Link>
            ) : <p>No Upcoming Appointments</p>}
          </div>             
        </div>
       : (
          <div>Loading</div>
        )
      }
    </div>
  );
};
export default DoctorAppointment;
