import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { api } from '../api';
import {helper} from '../helper';

const ReviewForm = (props) => {
const [reviewText, setReviewText] = useState('');
const [rating, setRating] = useState(5);
const [hasError, setHasError] = useState(false);
const [error, setError] = useState('');
const navigate = useNavigate();

const handleInputChange = (e) => {
    if(e.target.id === 'reviewText')
        setReviewText(e.target.value); 
    else
        setRating(e.target.value);
}

const validateReview = async (e) =>{
    e.preventDefault();
    const data = {};
    try
    {
        data["reviewText"] = helper.common.isValidReviewText(reviewText);
        setReviewText(data[reviewText]);
        data["rating"] = helper.common.isValidRating(rating);
        setRating(data[rating]);
    }catch(e){
        setHasError(true);
        setError(e.message);
        return;
    }
    
    try{
        data["doctorId"]=props.doctorId;
        data["patientId"]=JSON.parse(localStorage.getItem('id'));
        await api.review.post(data);
        window.location.reload(false);
        navigate("/doctor/"+props.doctorId);
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

  return (
    <div>
        <h2>Review Form</h2>
        <form onSubmit={validateReview} id="review-form">
            <label for="reviewText">Review Text : </label>
            <textarea id='reviewText' placeholder="Enter Review" name="reviewText" value={reviewText} onChange={handleInputChange} className="reviewInput" autoFocus/>
            <br/>
            <label for="reviewRating">Rating : </label>
            <input id="reviewRating" name="rating" value={rating} onChange={handleInputChange} type="number" step="0.1" className="reviewInput" min="1" max="5"/>
            <br/>
            <input type="submit" id="reviewSubmit" className="reviewSubmitButton"/>
        </form>
        {hasError && <div className="error">{error}</div>}
    </div>
  )
}

export default ReviewForm