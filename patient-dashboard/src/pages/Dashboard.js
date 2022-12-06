import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import { Link } from "react-router-dom";

const Dashboard = () => {    
    const [data, setData] = useState('');
    const [sData, setSData] = useState([]);
    const [fData, setFData] = useState([]);
    useEffect(() => {
      const fetchData = async()=>{
        const response = await api.doctor.getAllDoctor();
        setData({doctors : response.data});
      }
      if(!data)
      {
        fetchData();
      }
    },[]);

    const searchData = (d) => {
      setSData(d);
    }

    const filterData = (d) => {
      setFData(d);
    }

    return (
        <div>
          <components.Navbar searchData={searchData} filterData={filterData}/>
          <div>
          {data !== '' 
            ? <div className="doctorsContainer">
                <div>{data.doctors.length !== 0 ? data.doctors.map((element, index) =>
                  <Link to={{ pathname : `/doctor/${element._id}`, state : {appointmentId : element._id}}}>
                    <div className="card" key={element._id}>
                      <div className="cardHeading">Doctor - {index+1}</div>
                      <div className="cardText">Name : {element.name}</div>
                      <div className="cardText">Email : {element.email}</div>
                      <div className="cardText">Speciality : {element.speciality}</div>
                      <div className="cardText">Clinic Address : {element.clinicAddress}</div>
                      <div className="cardText">Zip : {element.zip}</div>
                      <div className="cardText">Rating : {element.rating ? element.rating : "Not Rated Yet"} </div>
                      <br/>
                    </div>
                  </Link>
                ) : <p>Doctor Not Found</p>}
                </div>
            </div> : <div>Loading</div>}
          </div>
        </div>
      )
}

export default Dashboard