const express = require('express');
const router = express.Router();
const {doctor : doctorData,patient: patientData, appointment : appointmentData, review : reviewData} = require("../data");
const helper = require('../helper');
const jwt = require("jsonwebtoken");
const { isValidMedicine } = require('../helper/doctor');
const { updatePrescription } = require('../data/doctor');


router
  .route('/')
  .get(async (req, res) => {
    try{
      const allDoctors = await doctorData.getAllDoctor();
      res.json(allDoctors);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })
  .post(async (req, res) => {
    const data = req.body;
    try{
      data.email = helper.common.isValidEmail(data.email);
      data.profilePicture = helper.common.isValidFilePath(data.profilePicture);
      data.name = helper.common.isValidName(data.name);
      data.speciality = helper.doctor.isValidSpeciality(data.speciality);
      data.clinicAddress = helper.doctor.isValidAddress(data.clinicAddress);
      data.zip = helper.common.isValidZip(data.zip);
      data.password = helper.common.isValidPassword(data.password);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try{
      const createDoctor = await doctorData.createDoctor(data.email, data.profilePicture, data.name, data.speciality, 
        data.clinicAddress, data.zip, data.password);
      res.json(createDoctor);
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
      let email = helper.common.isValidEmail(req.body.email);
      let password = helper.common.isValidPassword(req.body.password);
      let doctorInDb = await doctorData.checkDoctor(email,password);
      if(doctorInDb){
        const token = jwt.sign(
          { role: "doctor", email , userId : doctorInDb._id},
          "pd",
          {
            expiresIn: "1h",
          }
        );
        res.json({doctorData : doctorInDb, token});
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
  .route('/:doctorId')
  .get(async (req, res) => {
    let doctorId;
    try{
      doctorId = helper.common.isValidId(req.params.doctorId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try{
      const doctor = await doctorData.getDoctorById(doctorId);
      res.json(doctor);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

  })
  .patch(async (req, res) => {
    let data = req.body;
    let doctorId;
    try{
      doctorId = helper.common.isValidId(req.params.doctorId);
      data = helper.doctor.isValidDoctorData(data);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try{
      const updatedDoctor = await doctorData.updateDoctor(doctorId, data);
      res.json(updatedDoctor);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })

  router
  .route('/:doctorId/appointment')
  .get(async (req, res) => {
    //check doctor id 
    let doctorId = req.params.doctorId
    try {
      doctorId = helper.common.isValidId(req.params.doctorId);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //check if the doctor with that id is present
    try {
      await doctorData.getDoctorById(doctorId);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //get all the appointments of that doctor
    try {
      const doctorAppointments = await appointmentData.getDoctorAppointments(doctorId)
      res.json(doctorAppointments)
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })

  router
  .route('/:doctorId/slot')
  .get(async (req, res) => {
    try{
      req.params.doctorId = helper.common.isValidId(req.params.doctorId);
      if(req.query.date)
        req.query.date = helper.common.isValidTime(req.query.date);
      else
        req.query.date = new Date();
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    try{
      const doctorSlots = await appointmentData.getDoctorSlots(req.params.doctorId, req.query.date);
      res.json(doctorSlots);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })
  
  router
  .route('/:doctorId/review')
  .get(async (req, res) => {
    try{
      req.params.doctorId = helper.common.isValidId(req.params.doctorId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    
    try{
      const reviews = await reviewData.getAllReviewByDoctorId(req.params.doctorId);
      res.json(reviews);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json("Internal server error");
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

  })

  router
  .route('/:doctorId/patient/:patientId')
  .get(async (req, res) => {
    try{
      req.params.patientId = helper.common.isValidId(req.params.patientId);
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

  router
  .route('/:doctorId/patient/:patientId/prescription')
  .get(async (req, res) => {
    //check patient id 
    try {
      let id = req.params.patientId
      id = helper.common.isValidId(req.params.patientId);
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
  .post(async (req, res) => {

    try{
      let doctorId = req.params.doctorId;
      let patientId = req.params.patientId;
      const prescriptionData = req.body;
      patientId = helper.common.isValidId(req.params.patientId);
      doctorId = helper.common.isValidId(req.params.doctorId);
      await patientData.getPatientById(patientId);

      prescriptionData.disease=helper.common.isValidString(prescriptionData.disease);
      prescriptionData.medicine=isValidMedicine(prescriptionData.medicine);
      prescriptionData.documents=helper.common.isValidFilePath(prescriptionData.documents);
      prescriptionData.doctorSuggestion=helper.common.isValidString(prescriptionData.doctorSuggestion);

      let newPrescription = await doctorData.addPrescription(doctorId,patientId,prescriptionData.disease,prescriptionData.medicine,prescriptionData.documents,prescriptionData.doctorSuggestion);
      res.json(newPrescription);
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
  .route('/:doctorId/patient/:patientId/prescription/:prescriptionId')
  .patch(async (req, res) => {
    try{
      let doctorId = req.params.doctorId;
      let prescriptionId = helper.common.isValidId(req.params.prescriptionId);
      doctorId = helper.common.isValidId(req.params.doctorId);
      let patientId = req.params.patientId;
      const prescriptionData = req.body;
      patientId = helper.common.isValidId(req.params.patientId);
      if(!await patientData.getPatientById(patientId)) throw {status:'400',error:'No patient with that Id'};
      
      prescriptionData.disease=helper.common.isValidString(prescriptionData.disease);
      prescriptionData.medicine=isValidMedicine(prescriptionData.medicine);
      prescriptionData.documents=helper.common.isValidFilePath(prescriptionData.documents);
      prescriptionData.doctorSuggestion=helper.common.isValidString(prescriptionData.doctorSuggestion);

      let updatedPatient = await updatePrescription(patientId,prescriptionId,prescriptionData.disease,prescriptionData.medicine,prescriptionData.documents,prescriptionData.doctorSuggestion);
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
  .route('/:doctorId/patient/:patientId/medicalHistory')
  .get(async (req, res) => {

    //check patient id 
    try {
      let id = req.params.patientId
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

  })

  
  router
  .route('/:doctorId/patient/:patientId/testReport')
  .get(async (req, res) => {

    //check patient id 
    try {
      let id = req.params.patientId
      id = helper.common.isValidId(req.params.patientId);
      await patientData.getPatientById(id);
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
  
module.exports = router;
