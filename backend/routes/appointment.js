const express = require("express");
const router = express.Router();
const helper = require("../helper");
const { doctor: doctorData, appointment: appointmentData } = require("../data");
const { getAppointmentById } = require("../data/appointment");

router.route("/").post(async (req, res) => {
  const data = req.body;
  try {
    data.doctorID = helper.common.isValidId(data.doctorID);
    data.patientID = helper.common.isValidId(data.patientID);
    data.startTime = helper.appointment.isValidStartTime(data.startTime);
    data.appointmentLocation = helper.appointment.isValidAddress(
      data.appointmentLocation
    );
  } catch (e) {
    if (typeof e !== "object" || !("status" in e) || e.status === "500") {
      console.log(e);
      res.status(500).json(e.error);
    } else res.status(e.status).json(e.error);
    return;
  }

  try {
    const createAppointment = await appointmentData.createAppointment(
      data.doctorID,
      data.patientID,
      data.startTime,
      data.appointmentLocation
    );
    res.json(createAppointment);
  } catch (e) {
    console.log(e);
    if (typeof e !== "object" || !("status" in e)) res.status(500).json(e);
    else res.status(parseInt(e.status)).json(e.error);
    return;
  }
});

router
  .route("/:appointmentId")
  .get(async (req, res) => {
    //get id and check it
    let id = req.params.appointmentId;
    try {
      id = helper.common.isValidId(id);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }    

    try {
      let apppointment = await appointmentData.getAppointmentById(id)
      res.json(apppointment)
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }


  })
  .patch(async (req, res) => {
    let id = req.params.appointmentId;
    // console.log(req.body);
    let data = req.body;
    try {
      id = helper.common.isValidId(id);
    } catch (e) {
      // console.log(e);
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //data validation
    try {
      data = helper.appointment.validateData(data);
      // res.json(data)
    } catch (e) {
      console.log(e);
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //get the appointment to be updated
    await getAppointmentById(id)
    
    //updating the appointment
    try {
      const updatedAppointment = await appointmentData.updateAppointmentById(id, data)
      res.json(updatedAppointment)
    } catch (e) {
      console.log(e);
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    
  })
  .delete(async (req, res) => {
    //get id and check it
    let id = req.params.appointmentId;
    try {
      id = helper.common.isValidId(id);
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }    

    try {
      let deleteConfirmation = await appointmentData.deleteAppointmentById(id)
      res.json(deleteConfirmation)
    } catch (e) {
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  });

module.exports = router;
