const express = require('express');
const router = express.Router();
const data = require("../data");
const helper = require('../helper');
const reviewData = data.review;
router
  .route('/')
  .post(async (req, res) => {
    const data = req.body;
    try{
      data.doctorId = helper.common.isValidId(data.doctorId);
      data.patientId = helper.common.isValidId(data.patientId);
      data.rating = helper.review.checkRating(data.rating);
      if(data.reviewText != null)
        data.reviewText = helper.review.checkReviewText(data.reviewText);
      else 
        data.reviewText = null
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(e.status).json(e.error);
      return;
    }
    
    try{
      const newReview = await reviewData.createReview(data.doctorId,data.patientId,data.reviewText,data.rating);
      res.json(newReview);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(e.status).json(e.error);
      return;
    }
  })

module.exports = router;