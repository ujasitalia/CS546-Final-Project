import React, { useState, useEffect } from 'react';
import { api } from '../api';

export const DoctorReviews = (props) => {
  const [data, setData] = useState('');
  useEffect(() => {
    const fetchData = async()=>{
      const response = await api.doctor.getAllDoctorReview(props.doctorId);
      setData({reviews : response.data});
    }
    if(!data)
    {
      fetchData();
    }
  },[]);
  return (
    <div>
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