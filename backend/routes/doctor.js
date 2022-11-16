const express = require('express');
const router = express.Router();
const {doctor : doctorData} = require("../data");
const helper = require('../helper');

router
  .route('/')
  .get(async (req, res) => {
    try{
      const allDoctors = await doctorData.getAllDoctor();
      res.json(allDoctors);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
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
      data.specialty = helper.doctor.isValidSpecialty(data.specialty);
      data.clinicAddress = helper.doctor.isValidAddress(data.clinicAddress);
      data.city = helper.common.isValidCity(data.city);
      data.state = helper.common.isValidState(data.state);
      data.zip = helper.common.isValidZip(data.zip);
      data.password = helper.common.isValidPassword(data.password);
      data.schedule = helper.doctor.isValidSchedule(data.schedule);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
      return;
    }

    try{
      const createDoctor = await doctorData.createDoctor(data.email, data.profilePicture, data.name, data.specialty, 
        data.clinicAddress, data.city, data.state, data.zip, data.password, data.schedule);
      res.json(createDoctor);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })
  
  router
  .route('/login')
  .post(async (req, res) => {

  })

  router
  .route('/:doctorId')
  .get(async (req, res) => {
    let doctorId;
    try{
      doctorId = helper.common.isValidId(req.params.doctorId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try{
      const doctor = await doctorData.getDoctorById(doctorId);
      res.json(doctor);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
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
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try{
      const updatedDoctor = await doctorData.updateDoctor(doctorId, data);
      res.json(updatedDoctor);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
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
