const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const data = require("../data");
const helper = require('../helper');
const patientData = data.patient;
const appointmentData = data.appointment;
const commonHelper = helper.common;
const patientHelper = helper.patient;
const xss = require('xss');

router
  .route('/')
  .post(async (req, res) => {
    try{
      const bodyData = req.body;
      for(let i in bodyData)
        bodyData[i]=xss(bodyData[i])
      bodyData.email=commonHelper.isValidEmail(bodyData.email);
      bodyData.age = patientHelper.isValidAge(bodyData.age);
      bodyData.name=commonHelper.isValidName(bodyData.name);
      // bodyData.city=commonHelper.isValidCity(bodyData.city);
      // bodyData.state=commonHelper.isValidState(bodyData.state);
      bodyData.zip=commonHelper.isValidZip(bodyData.zip);
      bodyData.password=commonHelper.isValidPassword(bodyData.password);
      
      let newPatient = await patientData.createPatient(bodyData.email,bodyData.age,bodyData.name,bodyData.zip,bodyData.password);
      if(newPatient){
        const token = jwt.sign(
          { role: "patient", email:newPatient.email , userId : newPatient._id},
          "pd",
          {
            expiresIn: "1h",
          }
        );
        res.json({patientData : newPatient, token});
      } else throw {status:401,error:'Could not create patient'};

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
      const data = req.body
      for(let i in data)
        data[i]=xss(data[i])
      let email = commonHelper.isValidEmail(data.email);
      let password = commonHelper.isValidPassword(data.password);
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
      const data = req.body;
      for(let i in data)
        data[i]=xss(data[i])
      let id = commonHelper.isValidId(req.params.patientId);
      let body = patientHelper.isValidPatientUpdate(data);
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
    
    //get all the prescriptions of that patient
    try {
      
      let id = helper.common.isValidId(req.params.patientId);
      //check if the patient with that id is present
      await patientData.getPatientById(id);
      const patientPrescriptions = await patientData.getPatientPrescription(id)
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
    
    //check if the patient with that id is present
    try {
      let id = req.params.patientId;
      id = helper.common.isValidId(req.params.patientId);
      await patientData.getPatientById(id);
      const patientMedicalHistory = await patientData.getMedicalHistory(id)
      res.json(patientMedicalHistory)
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    //get all medical history of that patient

  })
  .post(async (req, res) => {
    try{
      let id = req.params.patientId;
      let diseaseData = req.body;
      for(let i in diseaseData)
        diseaseData[i]=xss(diseaseData[i])
      id = helper.common.isValidId(req.params.patientId); 
      //check if the patient with that id is present
      await patientData.getPatientById(id);

      diseaseData.disease = commonHelper.isValidString(diseaseData.disease);
      diseaseData.startDate = commonHelper.isValidPastDate(diseaseData.startDate);
      
      if(diseaseData.endDate){
        diseaseData.endDate=commonHelper.isValidPastDate(diseaseData.endDate);
      }
      else{
        diseaseData.endDate = null;
      }

      let updatedPatient = await patientData.addMedicalHistory(id,diseaseData.disease,diseaseData.startDate,diseaseData.endDate);
      // let newMedicalHistory = await patientData.updateMedicalHistory(id,diseaseData.disease,diseaseData.startDate);
      res.json(updatedPatient);
      }catch(e){
      if(e.status)
      {
        res.status(parseInt(e.status)).json(e.error);
      }
      else
        res.status(500).json(e);
      }
  })

  router
  .route('/:patientId/medicalHistory/:medicalHistoryId')
  .patch(async (req, res) => {
    // Only start date being considered and patient not given the access to update the medical history once entered
    try{
      const diseaseData = req.body;
      for(let i in diseaseData)
        diseaseData[i]=xss(diseaseData[i])
      let patientId = helper.common.isValidId(req.params.patientId);
      let medicalHistoryId = helper.common.isValidId(req.params.medicalHistoryId);
      await patientData.getPatientById(patientId);
      
      diseaseData.disease = commonHelper.isValidString(diseaseData.disease);
      diseaseData.startDate = commonHelper.isValidPastDate(diseaseData.startDate);
      
      if(diseaseData.endDate){
        diseaseData.endDate=commonHelper.isValidPastDate(diseaseData.endDate);
      }
      else{
        diseaseData.endDate == null;
      }

      let updatedPatient = await patientData.updateMedicalHistory(patientId,medicalHistoryId,diseaseData.disease,diseaseData.startDate,diseaseData.endDate);
      // let newMedicalHistory = await patientData.updateMedicalHistory(id,diseaseData.disease,diseaseData.startDate);
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
  .route('/:patientId/testReport')
  .get(async (req, res) => {
    //check patient id 
    try {
      let id = helper.common.isValidId(req.params.patientId);
      await patientData.getPatientById(id);
      //get all test reports of that patient
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
      for(let i in testData)
        testData[i]=xss(testData[i])
      id = helper.common.isValidId(req.params.patientId);
      //check if the patient with that id is present
      await patientData.getPatientById(id);

      testData.testName=commonHelper.isValidString(testData.testName);
      testData.testDocument=commonHelper.isValidFilePath(testData.testDocument);
      testData.testDate=commonHelper.isValidPastDate(testData.testDate);

      let newTestReport = await patientData.addTestReport(id,testData.testName,testData.testDocument,testData.testDate);
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
    //No update of test reports option given to patient 
    try{
      const testReportData = req.body;
      for(let i in testReportData)
        testReportData[i]=xss(testReportData[i])
      let patientId = helper.common.isValidId(req.params.patientId);
      let testReportId = helper.common.isValidId(req.params.testReportId);
      await patientData.getPatientById(patientId);

      testReportData.testName = commonHelper.isValidString(testReportData.testName);
      testReportData.testDate = commonHelper.isValidPastDate(testReportData.testDate);
      testReportData.testDocument = commonHelper.isValidString(testReportData.testDocument);

      let updatedPatient = await patientData.updateTestReport(patientId,testReportId,testReportData.testName,testReportData.testDate,testReportData.testDocument);
      // let newMedicalHistory = await patientData.updateMedicalHistory(id,diseaseData.disease,diseaseData.startDate);
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


module.exports = router;
