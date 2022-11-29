const express = require('express');
const router = express.Router();
const data = require("../data");
const helper = require('../helper');
const chatData = data.chat;
const reviewData = data.review;

router
  .route('/')
  .get(async (req, res) => {

  })
  .post(async (req, res) => {

  })
  
  router
  .route('/login')
  .post(async (req, res) => {

  })

  router
  .route('/:doctorId')
  .get(async (req, res) => {

  })
  .patch(async (req, res) => {

  })

  router
  .route('/:doctorId/appointment')
  .get(async (req, res) => {

  })

  router
  .route('/:doctorId/slot')
  .get(async (req, res) => {

  })
  
  router
  .route('/:doctorId/review')
  .get(async (req, res) => {
    try{
      req.params.doctorId = helper.common.isValidId(req.params.doctorId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    
    try{
      const reviews = await reviewData.getAllReviewByDoctorId(req.params.doctorId);
      res.json(reviews);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

  })

  router
  .route('/:doctorId/patient/:patientId')
  .get(async (req, res) => {

  })

  router
  .route('/:doctorId/patient/:patientId/prescription')
  .get(async (req, res) => {

  })
  .post(async (req, res) => {

  })

  router
  .route('/:doctorId/patient/:patientId/prescription/:prescriptionId')
  .patch(async (req, res) => {

  })
  
module.exports = router;