const express = require('express');
const router = express.Router();
const patientData = require('../data/patient')
const commonHelper = require('../helper/common');
const patientHelper = require('../helper/patient');

router
  .route('/')
  .post(async (req, res) => {
    try{
      const bodyData = req.body;
      let email=commonHelper.isValidEmail(bodyData.email);
      let age = patientHelper.isValidAge(bodyData.age);
      let profilePicture=commonHelper.isValidFilePath(bodyData.profilePicture);
      let name=commonHelper.isValidName(bodyData.name);
      let city=commonHelper.isValidCity(bodyData.city);
      let state=commonHelper.isValidState(bodyData.state);
      let zip=commonHelper.isValidZip(bodyData.zip);
      let password=commonHelper.isValidPassword(bodyData.password);
      
      let newPatient = await patientData.createPatient(email,age,profilePicture,name,city,state,zip,password);
      res.json(newPatient);

    }catch(e){
      if(e.status)
      {
        res.status(e.status).json(e.error);
      }
      else
        res.status(404).json(e);
    }
  })
  
  router
  .route('/login')
  .post(async (req, res) => {

  })

  router
  .route('/:patientId')
  .get(async (req, res) => {
    try{
      req.params.patientId = commonHelper.isValidId(req.params.patientId);
      const patient = await patientData.getPatientById(req.params.patientId);
      res.status(200).json(patient);
    }catch(e){
      if(e.status)
      {
        res.status(e.status).json(e.error);
      }
      else
        res.status(404).json(e);
    }
  })
  .patch(async (req, res) => {
    try{

      let id = commonHelper.isValidId(req.params.patientId);
      let body = patientHelper.isValidPatientUpdate(req.body);
      let updatedPatient = await patientData.updatePatient(body,id);
      res.json(updatedPatient);
    }catch(e){
      if(e.status)
      {
        res.status(e.status).json(e.error);
      }
      else
        res.status(404).json(e);
    }
  })

  router
  .route('/:patientId/appointment')
  .get(async (req, res) => {

  })

  router
  .route('/:patientId/chat/:doctorId')
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