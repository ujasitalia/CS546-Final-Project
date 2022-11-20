const helper = require("../helper");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const apCol = mongoCollections.appointment;
const doctorData = require("./doctor");



const getDoctorAppointments = async (id) => {
  //check for id
  id = helper.common.isValidId(id);
  //check if that doctor exists
  await doctorData.getDoctorById(id);
  //get all appointments of that doctor
  const appointmentCollection = await apCol();
  const appointments = await appointmentCollection
    .find({ doctorID: ObjectId(id) }, { projection: { _id: 0 } })
    .toArray();

  if (!appointments)
    throw { status: "404", error: "No apoointments for doctor with that id" };

  appointments.forEach((a) => {
    a.doctorID = a.doctorID.toString();
    a.patientID = a.patientID.toString();
  });

  return appointments;
};

module.exports = {
  // createAppointment,
  getDoctorAppointments,
};
