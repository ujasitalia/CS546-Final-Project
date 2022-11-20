const express = require('express');
const router = express.Router();
const helper = require('../helper');
const {doctor : doctorData, appointment : appointmentData} = require("../data");

router
  .route('/')
  .post(async (req, res) => {
    
  })

  router
  .route('/:appointmentId')
  .get(async (req, res) => {

  })
  .patch(async (req, res) => {

  })
  .delete(async (req, res) => {

  })

module.exports = router;