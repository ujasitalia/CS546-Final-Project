const express = require('express');
const router = express.Router();
const data = require("../data");
const helper = require('../helper');
const chatData = data.chat;

router
  .route('/')
  .post(async (req, res) => {

  })
  
  router
  .route('/login')
  .post(async (req, res) => {

  })

  router
  .route('/:patientId')
  .get(async (req, res) => {

  })
  .patch(async (req, res) => {

  })

  router
  .route('/:patientId/appointment')
  .get(async (req, res) => {

  })

  router
  .route('/:patientId/chat/:doctorId')
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
  .route('/:patientId/prescription')
  .get(async (req, res) => {

  })

  router
  .route('/:patientId/medicalHistory')
  .get(async (req, res) => {

  })
  .post(async (req, res) => {

  })

  router
  .route('/:patientId/medicalHistory/:medicalHistoryId')
  .patch(async (req, res) => {

  })

  router
  .route('/:patientId/testReport')
  .get(async (req, res) => {

  })
  .post(async (req, res) => {

  })

  router
  .route('/:patientId/testReport/:testReportId')
  .patch(async (req, res) => {

  })
  
module.exports = router;