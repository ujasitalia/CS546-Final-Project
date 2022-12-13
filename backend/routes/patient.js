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

    //check patient id 
    let id = req.params.patientId
    try {
      id = helper.common.isValidId(req.params.patientId);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //check if the patient with that id is present
    try {
      await patientData.getPatientById(id);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //get all the prescriptions of that patient
    try {
      const patientPrescriptions = await prescriptionData.getPatientPrescription(id)
      res.json(patientPrescriptions)
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

  })

  router
  .route('/:patientId/medicalHistory')
  .get(async (req, res) => {
    //check patient id 
    let id = req.params.patientId;
    try {
      id = helper.common.isValidId(req.params.patientId);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //check if the patient with that id is present
    try {
      await patientData.getPatientById(id);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    //get all medical history of that patient
    try {
      const patientMedicalHistory = await patientData.getMedicalHistory(id)
      res.json(patientMedicalHistory)
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

  })
  .post(async (req, res) => {
    try{

      let id = req.params.patientId;
      const diseaseData = req.body;
      try {
        id = helper.common.isValidId(req.params.patientId);
      } catch (e) {
        if(typeof e !== 'object' || !('status' in e))
          res.status(500).json(e);
        else
          res.status(parseInt(e.status)).json(e.error);
        return;
      }
      //check if the patient with that id is present
      try {
        await patientData.getPatientById(id);
      } catch (e) {
        if(typeof e !== 'object' || !('status' in e))
          res.status(500).json(e);
        else
          res.status(parseInt(e.status)).json(e.error);
        return;
      }

      diseaseData.disease = commonHelper.isValidString(diseaseData.disease);
      diseaseData.startDate = commonHelper.isValidTime(diseaseData.startDate);
      if(diseaseData.endDate){
        diseaseData.endDate=commonHelper.isValidTime(diseaseData.endDate);
      }
      else{
        bodyData.endDate == null;
      }

      let newMedicalHistory = await patientData.updateMedicalHistory(id,diseaseData.disease,diseaseData.startDate,diseaseData.endDate);
      //let newMedicalHistory = await patientData.updateMedicalHistory(id,diseaseData.disease,diseaseData.startDate);
      res.json(newMedicalHistory);
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
  .route('/:patientId/medicalHistory/:medicalHistoryId')
  .patch(async (req, res) => {
    try{
      let id = commonHelper.isValidId(req.params.medicalHistoryId);
      const medicalHistoryData = req.body;
      medicalHistoryData.disease=commonHelper.isValidString(medicalHistoryData.disease);
      medicalHistoryData.startDate=commonHelper.isValidTime(medicalHistoryData.startDate);
      if(medicalHistoryData.endDate){
        medicalHistoryData.endDate=commonHelper.isValidTime(medicalHistoryData.endDate);
      }
      else{
        medicalHistoryData.endDate == null;
      }
      let updatedPatient = await patientData.editMedicalHistory(id,medicalHistoryData.disease,medicalHistoryData.startDate,medicalHistoryData.endDate);
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
  .route('/:patientId/testReport')
  .get(async (req, res) => {
    //check patient id 
    let id = req.params.patientId;
    try {
      id = helper.common.isValidId(req.params.patientId);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //check if the patient with that id is present
    try {
      await patientData.getPatientById(id);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //get all test reports of that patient
    try {
      const patientTestReport = await patientData.getTestReport(id)
      res.json(patientTestReport)
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

  })
  .post(async (req, res) => {

    try{

      let id = req.params.patientId;
      const testData = req.body;
      try {
        id = helper.common.isValidId(req.params.patientId);
      } catch (e) {
        if(typeof e !== 'object' || !('status' in e))
          res.status(500).json(e);
        else
          res.status(parseInt(e.status)).json(e.error);
        return;
      }
      //check if the patient with that id is present
      try {
        await patientData.getPatientById(id);
      } catch (e) {
        if(typeof e !== 'object' || !('status' in e))
          res.status(500).json(e);
        else
          res.status(parseInt(e.status)).json(e.error);
        return;
      }

      testData.testName=commonHelper.isValidString(testData.testName);
      testData.testDocument=commonHelper.isValidFilePath(testData.testDocument);
      

      let newTestReport = await patientData.updateTestReport(id,testData.testName,testData.testDocument);
      res.json(newTestReport);
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
  .route('/:patientId/testReport/:testReportId')
  .patch(async (req, res) => {
    try{
      let id = commonHelper.isValidId(req.params.testReportId);
      const testData = req.body;
      testData.testName=commonHelper.isValidString(testData.testName);
      testData.testDocument=commonHelper.isValidFilePath(testData.testDocument);
      let updatedPatient = await patientData.editPatientReports(id,testData.testName,testData.testDocument);
      res.json(updatedPatient);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })


module.exports = router;
