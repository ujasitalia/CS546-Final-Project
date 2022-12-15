import React, { useState, useEffect } from 'react';
import { components } from '../components';
import { api } from '../api';
import { Link } from "react-router-dom";
import Chat from '../components/Chat';
import { useNavigate } from "react-router-dom";
const Dashboard = () => {    
    const [data, setData] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
      const fetchData = async()=>{
        const response = await api.doctor.getAllDoctor();
        setData({doctors : response.data});
        setFilteredDoctors(response.data);
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
        <div><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css" 
        integrity="sha384-9gVQ4dYFwwWSjIDZnLEWnxCjeSWFphJiwGPXr1jddIhOegiu1FwO5qRGvFXOdJZ4" 
        crossorigin="anonymous"></link>
          <components.Navbar handleSearch={handleSearch}/>
          <components.SecondaryNavbar/>
          <div>
          {filteredDoctors !== '' 
            ? <div className="doctorsContainer">
                          <div className='row g-4'>{filteredDoctors.length !== 0 ? filteredDoctors.map((element, index) =>
                            <div class="col-sm-4 col-xm-6 card">
                          <Link to={{ pathname : `/doctor/${element._id}`, state : {appointmentId : element._id}}}>
                              <div key={element._id}>
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
          <Chat/>
        </div>
      )
}

export default Dashboard
