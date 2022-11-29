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