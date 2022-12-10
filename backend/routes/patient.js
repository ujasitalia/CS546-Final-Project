const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const data = require("../data");
const helper = require('../helper');
const patientData = data.patient;
const appointmentData = data.appointment;
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
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })
  
  router
  .route('/login')
  .post(async (req, res) => {
    try{
      let email = commonHelper.isValidEmail(req.body.email);
      let password = commonHelper.isValidPassword(req.body.password);
      let userInDb = await patientData.checkUser(email,password);
      if(userInDb){
        const token = jwt.sign(
          { role: "patient", email , userId : userInDb._id},
          "pd",
          {
            expiresIn: "1h",
          }
        );
        res.json({patientData : userInDb, token});
      } else throw {status:401,error:'Invalid email or password'};
      
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
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
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })
  .patch(async (req, res) => {
    try{

      let id = commonHelper.isValidId(req.params.patientId);
      let body = patientHelper.isValidPatientUpdate(req.body);
      let updatedPatient = await patientData.updatePatient(body,id);
      res.json(updatedPatient);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })

  router
  .route('/:patientId/appointment')
  .get(async (req, res) => {
    //check patient id 
    try {
      id = helper.common.isValidId(req.params.patientId);
    } catch (e) {
      console.log(e);
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //check if the doctor with that id is present
    try {
      await patientData.getPatientById(id);
    } catch (e) {
      console.log(e);
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //get all the appointments of that doctor
    try {
      const patientAppointments = await appointmentData.getPatientAppointment(id)
      res.json(patientAppointments)
    } catch (e) {
      console.log(e);
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
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
