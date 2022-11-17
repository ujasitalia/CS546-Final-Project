const express = require('express');
const router = express.Router();
const helper =  require('../helper/index')
const data = require('../data/index')
const patientData = data.patient;
const commonHelper = helper.common;
const patientHelper = helper.patient;

router
  .route('/')
  .post(async (req, res) => {
    try{
      const bodyData = req.body;
      bodyData.email=commonHelper.isValidEmail(bodyData.email);
      bodyData.age = patientHelper.isValidAge(bodyData.age);
      bodyData.profilePicture=commonHelper.isValidFilePath(bodyData.profilePicture);
      bodyData.name=commonHelper.isValidName(bodyData.name);
      bodyData.city=commonHelper.isValidCity(bodyData.city);
      bodyData.state=commonHelper.isValidState(bodyData.state);
      bodyData.zip=commonHelper.isValidZip(bodyData.zip);
      bodyData.password=commonHelper.isValidPassword(bodyData.password);
      
      let newPatient = await patientData.createPatient(bodyData.email,bodyData.age,bodyData.profilePicture,bodyData.name,bodyData.city,bodyData.state,bodyData.zip,bodyData.password);
      res.json(newPatient);

    }catch(e){
      if(e.status)
      {
        res.status(e.status).json(e.error);
      }
      else
        res.status(500).json(e);
    }
  })
  
  router
  .route('/login')
  .post(async (req, res) => {
    try{
      let email = commonHelper.isValidEmail(req.body.email);
      let password = commonHelper.isValidPassword(req.body.password);
      let userInDb = await patientData.checkUser(email,password);
      if(userInDb.authenticatedUser){
        req.session.username = username;
        req.session.role = 'patient';
        res.redirect('/protected');
      } 
    }catch(e){
      if(e.status)
      {
        res.status(e.status).render('userLogin',{title:'Login',errorExist:true,error:e.error});
      }
      else
        res.status(500).json('Internal server error');
    }

  })

  router
  .route('/:patientId')
  .get(async (req, res) => {
    try{
      req.params.patientId = commonHelper.isValidId(req.params.patientId);
      const patient = await patientData.getPatientById(req.params.patientId);
      res.json(patient);
    }catch(e){
      if(e.status)
      {
        res.status(e.status).json(e.error);
      }
      else
        res.status(500).json(e);
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
        res.status(500).json(e);
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
