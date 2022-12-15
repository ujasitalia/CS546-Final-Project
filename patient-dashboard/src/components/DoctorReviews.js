import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useNavigate } from "react-router-dom";

export const DoctorReviews = (props) => {
  const [data, setData] = useState('');
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async()=>{
      try{
        const response = await api.doctor.getAllDoctorReview(props.doctorId);
        setData({reviews : response.data});
        setHasError(false);
      }catch(e){
        if(e.response.status===500)
          navigate("/error");
        else if(e.response.status===401 || e.response.status===403)
        {
          localStorage.clear();
          navigate("/login");
        }else{
          setHasError(true);
          setError(e.response.data);
        }
      }
    }
    if(!data)
    {
      fetchData();
    }
  },[]);
  return (
    <div>
      {hasError && <div className="error">{error}</div>}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css" rel="stylesheet"></link>
      <br/>
        {data !== '' 
        ? <div className="doctorsReveiwContainer">
            <div>{data.reviews.length !== 0 ? data.reviews.map((element, index) =>
              <div className="card" key={element._id}>
                <div className="cardHeading">review - {index+1}</div>
                <div className="cardText">Rating : {element.rating}</div>
                <div className="cardText">Review : {element.reviewText ? element.reviewText : "Don't have review text"}</div>
                <br/>
              </div>
            ) : <p>No Review Found</p>}
            </div>
        </div> : <div>Loading</div>}
      </div>
  )
}

export default DoctorReviews;