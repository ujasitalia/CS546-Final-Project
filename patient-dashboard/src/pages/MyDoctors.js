import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import { Link, useNavigate} from "react-router-dom";

const MyDoctors = () => {
    const [data, setData] = useState('');
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
      const fetchData = async()=>{
        try{
          const dr = [];
          const res = await api.patient.getPatient(JSON.parse(localStorage.getItem('id')));
          for(let i=0;i<res.data.myDoctors.length;i++){
            const response = await api.doctor.getDoctor(res.data.myDoctors[i]);
            dr.push(response.data);
          }
          setData(dr);
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
      }
      if(!JSON.parse(localStorage.getItem('token_data')))
      {
        navigate("/login");
      }
      if(!data)
      {
        fetchData();
      }
    },[]);
  return (
    <div>
        <components.Navbar/>
        <components.SecondaryNavbar/>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
        integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" 
        crossOrigin="anonymous"></link>
          <div>
          {hasError && <div className="error">{error}</div>}
          {data !== '' 
            ? <div className="doctorsContainer">
                          <div className='row g-4'>{data.length !== 0 ? data.map((element, index) =>
                            <div  className="col-sm-4 col-xm-6 card" key={element._id}>
                          <Link to={{ pathname : `/doctor/${element._id}`, state : {appointmentId : element._id}}}>
                              <div>
                                  <div className="cardHeading">Doctor - {index+1}</div>
                                  <div className="cardText">Name : {element.name}</div>
                                  <div className="cardText">Email : {element.email}</div>
                                  <div className="cardText">Speciality : {element.speciality}</div>
                                  <div className="cardText">Clinic Address : {element.clinicAddress}</div>
                                  <div className="cardText">Zip : {element.zip}</div>
                                  <div className="cardText">Rating : {element.rating ? element.rating : "Not Rated Yet"}</div>
                                  <br/>
                              </div>
                            </Link>
                            </div>
                          ) : <p>Doctor Not Found</p>}
                          </div>
            </div> : <div>Loading</div>}
          </div>
        </div>
  )
}

export default MyDoctors