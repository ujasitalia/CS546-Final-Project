const express = require("express");
const router = express.Router();
const helper = require("../helper");
const { appointment: appointmentData } = require("../data");

router.route("/").post(async (req, res) => {
  const data = req.body;
  try {
    data.doctorId = helper.common.isValidId(data.doctorId);
    data.patientId = helper.common.isValidId(data.patientId);
    data.startTime = helper.appointment.isValidStartTime(data.startTime);
    if(data.isOnline)
      data.appointmentLocation = helper.common.isValidLink(data.appointmentLocation);
    else
      data.appointmentLocation = helper.appointment.isValidAddress(data.appointmentLocation);
  } catch (e) {
    if (typeof e !== "object" || !("status" in e)) {
      res.status(500).json("Internal server error");
    } else res.status(parseInt(e.status)).json(e.error);
    return;
  }

  try {
    const createAppointment = await appointmentData.createAppointment(
      data.doctorId,
      data.patientId,
      data.startTime,
      data.appointmentLocation,
      data.isOnline
    );
    res.json(createAppointment);
  } catch (e) {
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
      if (typeof e !== "object" || !("status" in e)) res.status(500).json(e);
      else res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try {
      let apppointment = await appointmentData.getAppointmentById(id);
      res.json(apppointment);
    } catch (e) {
      if (typeof e !== "object" || !("status" in e)) res.status(500).json(e);
      else res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })
  .patch(async (req, res) => {
    let id = req.params.appointmentId;
    let data = req.body.data;
    try {
      id = helper.common.isValidId(id);
    } catch (e) {
      if (typeof e !== "object" || !("status" in e)) res.status(500).json(e);
      else res.status(parseInt(e.status)).json(e.error);
      return;
    }
    //data validation
    try {
      data = helper.appointment.validateData(data);
      //get the appointment to be updated
      await appointmentData.getAppointmentById(id);
      // res.json(data)
    } catch (e) {
      if (typeof e !== "object" || !("status" in e)) res.status(500).json(e);
      else res.status(parseInt(e.status)).json(e.error);
      return;
    }

    //updating the appointment
    try {
      const updatedAppointment = await appointmentData.updateAppointmentById(
        id,
        data
      );
      res.json(updatedAppointment);
    } catch (e) {
      if (typeof e !== "object" || !("status" in e)) res.status(500).json(e);
      else res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })
  .delete(async (req, res) => {
    //get id and check it
    let id = req.params.appointmentId;
    try {
      id = helper.common.isValidId(id);
    } catch (e) {
      if (typeof e !== "object" || !("status" in e)) res.status(500).json(e);
      else res.status(parseInt(e.status)).json(e.error);
      return;
    }

    try {
      let deleteConfirmation = await appointmentData.deleteAppointmentById(id);
      res.json(deleteConfirmation);
    } catch (e) {
      if (typeof e !== "object" || !("status" in e)) res.status(500).json(e);
      else res.status(parseInt(e.status)).json(e.error);
      return;
    }
  });

module.exports = router;