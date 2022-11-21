const helper = require("../helper");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const apCol = mongoCollections.appointment;
const doctorData = require("./doctor");

const createAppointment = async (
  doctorID,
  patientID,
  startTime,
  appointmentLocation
) => {
  //verify data using helper functions
  doctorID = helper.common.isValidId(doctorID);
  patientID = helper.common.isValidId(patientID);
  startTime = helper.appointment.isValidStartTime(startTime);
  appointmentLocation = helper.appointment.isValidAddress(appointmentLocation);

  //get doctor data to verify the time and day
  const docData = await doctorData.getDoctorById(doctorID);

  //verify if startTime has valid day 
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = weekdays[new Date(startTime).getDay()].toLocaleLowerCase();  
  if(!Object.keys(docData.schedule).includes(day)) throw {status: "400", error: `Doctor is not available on ${day}`}

  //check for slots  
  const t = startTime.slice(11,16)
  const [time, modifier] = t.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") { 
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  const apTime = hours+':'+minutes;
  
  let flag = 0
  const docScheduleForThatDay = docData.schedule[day]
  docScheduleForThatDay.forEach(sch => {
    if(apTime >= sch[0] && apTime < sch[1]) {
      flag = 1
    }
  })
  if(flag === 0) throw {status: "400", error: `doctor is not available during ${apTime}`}

  //if everything is fine get appointment collection and create a new appointment
  const appointmentCollection = await apCol();

  const newAppointment = {
    doctorID,
    patientID,
    startTime,
    appointmentLocation,
  };

  const insertInfo = await appointmentCollection.insertOne(newAppointment);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { status: "500", error: "Could not add appointment" };

  const newId = insertInfo.insertedId.toString();
  //   const doctor = await getAppointmentById(newId);

  return newId;
};

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

const getAppointmentById = async (id) => {
  //check for id
  id = helper.common.isValidId(id);

  //get all appointments of that doctor
  const appointmentCollection = await apCol();
  const appointment = await appointmentCollection
    .findOne({ _id: ObjectId(id) }, { projection: { _id: 0 } })

  // console.log(appointment);
  if(!appointment) throw {status: "404", error: "No appointment found with that id"}
  return appointment
}


module.exports = {
  createAppointment,
  getDoctorAppointments,
  getAppointmentById,
};
