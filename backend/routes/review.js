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
      data.doctorID = helper.common.isValidId(data.doctorID);
      data.patientId = helper.common.isValidId(data.patientId);
      data.rating = helper.review.checkRating(data.rating);
      data.reviewText = helper.review.checkReviewText(data.reviewText);

    }catch(e){
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
      return;
    }
    
    try{
      const newReview = await reviewData.createReview(data.doctorID,data.patientId,data.reviewText,data.rating);
      res.json(newReview);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
      return;
    }
  })

module.exports = router;