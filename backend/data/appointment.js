const helper = require("../helper");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId, LoggerLevel } = require("mongodb");
const apCol = mongoCollections.appointment;
const doctorData = require("./doctor");
const patientData = require("./patient")
const data = require(".");


const getAvailableSlots = async (id, day) => {
  // get doctor's schedule, get all appointment that were booked ( get all doctor's appointments), get the available slots

  
  const appointments = await getDoctorAppointments(id)
  
  const docData = await doctorData.getDoctorById(id)
  const scheduleThatDay = docData.schedule[day]
  // console.log(scheduleThatDay);
  let timeSlotsTaken = []
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (i of appointments){   
    // console.log(i.startTime); 
    let startTime = i.startTime
    const d = weekdays[new Date(startTime).getDay()].toLocaleLowerCase();
    // console.log(d);
    if(d === day.toLocaleLowerCase()){
      const t = startTime.slice(11, 16);
      const [time, modifier] = t.split(" ");
      let [hours, minutes] = time.split(":");
      if (hours === "12") {
        hours = "00";
      }
      if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }
      const apTime = hours + ":" + minutes;
      timeSlotsTaken.push(apTime)
    }
  }
  //creating all possible slots
  let allPossibleSlots = []
  for(i of scheduleThatDay){
    const start = Number(i[0].split(':')[0])
    const duration = Number(i[1].split(':')[0]) - Number(i[0].split(':')[0])
    for (j=start; j<start+duration; j++){
      allPossibleSlots.push(`${j}:00`)
    }
  }
  
  // getting all available slots
  let allAvailableSlots = []
  for(i of allPossibleSlots){
    if(!timeSlotsTaken.includes(i)){
      allAvailableSlots.push(i)
    }
  }
  return allAvailableSlots
  
}


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
  if (!Object.keys(docData.schedule).includes(day))
    throw { status: "400", error: `Doctor is not available on ${day}` };

  //check for slots
  const t = startTime.slice(11, 16);
  const [time, modifier] = t.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  const apTime = hours + ":" + minutes;

  let flag = 0;
  const docScheduleForThatDay = docData.schedule[day];
  docScheduleForThatDay.forEach((sch) => {
    if (apTime >= sch[0] && apTime < sch[1]) {
      flag = 1;
    }
  });
  if (flag === 0)
    throw { status: "400", error: `doctor is not available during ${apTime}` };

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
  .find({ doctorID: id })
  .toArray();  

  if (!appointments)
    throw { status: "404", error: "No apoointments for doctor with that id" };

  appointments.forEach((a) => {
    a.doctorID = a.doctorID.toString();
    a.patientID = a.patientID.toString();
  });

  return appointments;
};

const getPatientAppointment = async (id) => {
  //check for id
  id = helper.common.isValidId(id);
  //check if that doctor exists
  await patientData.getPatientById(id);
  //get all appointments of that doctor
  const appointmentCollection = await apCol();
  
  const appointments = await appointmentCollection
  .find({ patientID: id })
  .toArray();  

  if (!appointments)
    throw { status: "404", error: "No apoointments for doctor with that id" };

  appointments.forEach((a) => {
    a.doctorID = a.doctorID.toString();
    a.patientID = a.patientID.toString();
  });

  return appointments;
}

const getAppointmentById = async (id) => {
  //check for id
  id = helper.common.isValidId(id);

  //get all appointments of that doctor
  const appointmentCollection = await apCol();
  const appointment = await appointmentCollection.findOne(
    { _id: ObjectId(id) }
  );

  // console.log(appointment);
  if (!appointment)
    throw { status: "404", error: "No appointment found with that id" };
  return appointment;
};

const deleteAppointmentById = async (id) => {
  //check for id
  id = helper.common.isValidId(id);

  //get all appointments of that doctor
  const appointmentCollection = await apCol();
  //check if appointment exists
  const appointment = await appointmentCollection.findOne(
    { _id: ObjectId(id) },
    { projection: { _id: 0 } }
  );
  if (!appointment)
    throw { status: "404", error: "No appointment found with that id" };

  const deletedAppointment = await appointmentCollection.deleteOne({
    _id: ObjectId(id),
  });
  if (deletedAppointment.deletedCount === 1)
    return `Successfully deleted ${id}`;
  else throw { status: "500", error: "Could not delete appointment" };
};

const updateAppointmentById = async (id, data) => {
  //check for id
  id = helper.common.isValidId(id);

  //validate data to update
  data = helper.appointment.validateData(data);

  //get all appointments of that doctor
  let appointmentCollection = await apCol();

  //check if appointment exists
  const appointment = await getAppointmentById(id)
  const docData = await doctorData.getDoctorById(appointment.doctorID)
    
  //if startTime... check startTime
  if(Object.keys(data).includes("startTime")) {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = weekdays[new Date(data.startTime).getDay()].toLocaleLowerCase();
    if (!Object.keys(docData.schedule).includes(day))
      throw { status: "400", error: `Doctor is not available on ${day}` };

    //check for slots
    const t = data.startTime.slice(11, 16);
    const [time, modifier] = t.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    const apTime = hours + ":" + minutes;

    flag = 0;
    const docScheduleForThatDay = docData.schedule[day];
    docScheduleForThatDay.forEach((sch) => {
      if (apTime >= sch[0] && apTime < sch[1]) {
        flag = 1;
      }
    });
    if (flag === 0)
      throw { status: "400", error: `doctor is not available during ${apTime}` };
  }

  const updatedInfo = await appointmentCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: data }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw { status: "400", error: "could not update appointment successfully" };
  }

  return await getAppointmentById(id);
};

module.exports = {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointment,
  getAppointmentById,
  deleteAppointmentById,
  updateAppointmentById,
  getAvailableSlots
};
