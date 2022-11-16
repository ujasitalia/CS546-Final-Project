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
  .route('/:doctorId/chat/:patientId')
  .get(async (req, res) => {
    const data = req.body;
    try{
      patientId = helper.common.isValidId(req.params.patientId);
      doctorId = helper.common.isValidId(req.params.doctorId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
      return;
    }
    
    try{
      const chatHistory = await chatData.getAllchat(doctorId,patientId);
      res.json(chatHistory);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
      return;
    }
  })

  router
  .route('/:doctorId/review')
  .get(async (req, res) => {
    const data = req.body;
    try{
      doctorId = helper.common.isValidId(req.params.doctorId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
      return;
    }
    
    try{
      const reviews = await reviewData.getAllReviewByDoctorId(doctorId);
      res.json(reviews);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
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