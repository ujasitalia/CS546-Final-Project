import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { api } from '../api';
import { components } from '../components';
import { useNavigate } from "react-router-dom";

const MyPatients = () => {
  const [data, setData] = useState('');
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async()=>{
      try{
        const response = await api.doctor.getDoctor(JSON.parse(localStorage.getItem('id')));
        let data = []
        for(let i=0;i<response.data.myPatients.length;i++){
          const res = await api.patient.getPatient(response.data.myPatients[i][0]);
          data.push(res.data)
        }
        setData({patients : data});
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
      {data && <components.Navbar/>}
      <br/>
      {hasError && <div className="error">{error}</div>}
      <div>{data !== '' 
            ? <div className="doctorsContainer">
                          <div className='row g-4'>{data.patients.length !== 0 ? data.patients.map((element, index) =>
                            <div  className="col-sm-4 col-xm-6 card" key={index}>
                          <Link to={{ pathname : `/patient/${element._id}`}}>
                              <div key={element._id}>
                                  <div className="cardHeading">Patient - {index+1}</div>
                                  <div className="cardText">Name : {element.name}</div>
                                  <div className="cardText">Email : {element.email}</div>
                                  <div className="cardText">age : {element.age}</div>
                                  <div className="cardText">Zip : {element.zip}</div>
                                  <br/>
                              </div>
                            </Link>
                            </div>
                          ) : <p>Patient Not Found</p>}
                          </div>
            </div> : <div>Loading</div>}
        </div>
    </div>
  )
}

export default MyPatients