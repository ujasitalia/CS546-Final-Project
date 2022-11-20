const express = require("express");
const router = express.Router();
const helper = require("../helper");
const { doctor: doctorData, appointment: appointmentData } = require("../data");

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
  .get(async (req, res) => {})
  .patch(async (req, res) => {})
  .delete(async (req, res) => {});

module.exports = router;
