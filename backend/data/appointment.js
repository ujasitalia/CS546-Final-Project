const helper = require("../helper");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const apCol = mongoCollections.appointment;
const doctorData = require("./doctor");
const patientData = require("./patient")

const getAvailableSlots = async (id, day, date) => {  
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
    const da = i.startTime.split('T')[0]
    const d = weekdays[new Date(startTime).getDay()].toLocaleLowerCase();
    // console.log(d);
    if(d === day.toLocaleLowerCase() && da === date){
      // console.log(da);
      const t = startTime.slice(11, 16);
      const [time, modifier] = t.split(" ");
      let [hours, minutes] = time.split(":");
      // if (hours === "24") {
      //   hours = "00";
      // }
      // if (modifier === "PM") {
      //   hours = parseInt(hours, 10) + 12;
      // }
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
  await doctorData.getDoctorById(doctorID);

  const slots = await getDoctorSlots(doctorID, new Date(startTime));
  let flag = false;
  slots.forEach(slot =>{
    if(slot[0].split(":")[0] === startTime.split("T")[1].split(":")[0])
      flag = true
  })
  
  if(!flag)
    throw { status: "400", error: `slot not available` };
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
    return "Could not add appointment"

  const newId = insertInfo.insertedId.toString();
  const appointment = await getAppointmentById(newId);

  return appointment;
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
  const slots = await getDoctorSlots(appointment.doctorID, new Date(data.startTime));
  let flag = false;
  slots.forEach(slot =>{
    if(slot[0].split(":")[0] === data.startTime.split("T")[1].split(":")[0])
      flag = true;
  })
  
  if(!flag)
    throw { status: "400", error: `slot not available` };

  const updatedInfo = await appointmentCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: data }
  );
  if (updatedInfo.modifiedCount === 0) {
    return "select a different date/time than original" ;
  }

  return await getAppointmentById(id);
};

const getDoctorSlots = async (doctorId, date = new Date()) => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slotSize = 30;
  const doctor = await doctorData.getDoctorById(doctorId);

  if(date.getDay()>5)
    return [];

  const day = weekDays[date.getDay() - 1];
  const schedule = doctor.schedule[day.toLowerCase()];

  if(!schedule)
    return [];
  let slot = [];

  let appointments = await getDoctorAppointments(doctorId);
  appointments = appointments.filter( appointment =>{
    if(new Date(appointment.startTime).getDate() == date.getDate())
      return appointment;
  })

  const isAppointmentNotExistInSlot = (hour, minite) => {

    for(let i=0;i<appointments.length;i++)
    {
      const h = new Date(appointments[i].startTime).getHours();
      const m = new Date(appointments[i].startTime).getMinutes();
      if( h == hour && m == minite)
      {
        appointments.splice(i, 1);
        return false;
      }
    }
      return true;
  }

  for(let i=0;i<schedule.length;i++)
  {
    const startTime = schedule[i][0].split(':');
    const endTime = schedule[i][1].split(':');
    startTime[0] = parseInt(startTime[0]);
    startTime[1] = parseInt(startTime[1]);
    endTime[0] = parseInt(endTime[0]);
    endTime[1] = parseInt(endTime[1]);
    while(1)
    {
      if((startTime[1] + slotSize < 60 && startTime[0]==endTime[0] && startTime[1] + slotSize > endTime[1]) || (startTime[1] + slotSize > 59 && (startTime[0]==endTime[0] || (startTime[0]+1 == endTime[0] && (startTime[1] + slotSize > 60)%60 > endTime[1]))))
        break;
      if(startTime[1] + slotSize < 60)
      {
        if(isAppointmentNotExistInSlot(startTime[0], startTime[1]))
          slot = [...slot, [startTime[0].toString().padStart(2, '0') + ':' + startTime[1].toString().padStart(2, '0'), startTime[0].toString().padStart(2, '0') + ':' + (startTime[1] + slotSize).toString().padStart(2, '0')]];
        startTime[1] += slotSize; 
      }else{
        if(isAppointmentNotExistInSlot(startTime[0], startTime[1]))
          slot = [...slot, [startTime[0].toString().padStart(2, '0') + ':' + startTime[1].toString().padStart(2, '0'), (startTime[0] + 1).toString().padStart(2, '0') + ':' + ((startTime[1] + slotSize)%60).toString().padStart(2, '0')]];
        startTime[0] += 1;
        startTime[1] = (startTime[1] + slotSize)%60; 
      }
    }
  }
  return slot;
}

module.exports = {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointment,
  getAppointmentById,
  deleteAppointmentById,
  updateAppointmentById,
  getAvailableSlots,
  getDoctorSlots
};
