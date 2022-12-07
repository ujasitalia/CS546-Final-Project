import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import { Link } from "react-router-dom";

const Dashboard = () => {    
    const [data, setData] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState('');
    
    useEffect(() => {
      const fetchData = async()=>{
        const response = await api.doctor.getAllDoctor();
        setData({doctors : response.data});
        setFilteredDoctors(response.data);
      }
      if(!data)
      {
        fetchData();
      }
    },[]);

    const handleSearch = (keyword, speciality="") =>{
      let filtered = [];
      if(speciality)
      {
        data.doctors.forEach(element => {
          if(element.speciality.toLowerCase() === speciality.toLowerCase())
            filtered.push(element);
        });
      }else{
        filtered = [...data.doctors];
      }

      if(keyword)
      {
        filtered = filtered.filter(element => {
          if(element.name.toLowerCase().includes(keyword.toLowerCase()))
            return element;
          else if(element.zip.includes(keyword))
            return element;
        })
      }
      setFilteredDoctors(filtered);
    }

    return (
        <div>
          <components.Navbar handleSearch={handleSearch}/>
          <div>
          {filteredDoctors !== '' 
            ? <div className="doctorsContainer">
                          <div>{filteredDoctors.length !== 0 ? filteredDoctors.map((element, index) =>
                          <Link to={{ pathname : `/doctor/${element._id}`, state : {appointmentId : element._id}}}>
                              <div className="card" key={element._id}>
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
                          ) : <p>Doctor Not Found</p>}
                          </div>
            </div> : <div>Loading</div>}
          </div>
        </div>
      )
}

export default Dashboard