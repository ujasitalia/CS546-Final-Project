const express = require('express');
const router = express.Router();

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

  })

  router
  .route('/:doctorId/review')
  .get(async (req, res) => {

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