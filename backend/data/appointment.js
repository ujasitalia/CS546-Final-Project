const helper = require("../helper");
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const apCol = mongoCollections.appointment;
const doctorData = require("./doctor");
const patientData = require("./patient")
const {email} = require("../service");

const createAppointment = async (
  doctorId,
  patientId,
  startTime,
  appointmentLocation
) => {
  //verify data using helper functions
  doctorId = helper.common.isValidId(doctorId);
  patientId = helper.common.isValidId(patientId);
  startTime = helper.appointment.isValidStartTime(startTime);
  appointmentLocation = helper.appointment.isValidAddress(appointmentLocation);

  //get doctor data to verify the time and day
  let doctor = await doctorData.getDoctorById(doctorId);
  let patient = await patientData.getPatientById(patientId);

  const slots = await getDoctorSlots(doctorId, new Date(startTime));

  let flag = false;
  slots.forEach(slot =>{
    if(slot[0].split(":")[0] === startTime.split("T")[1].split(":")[0])
      flag = true;
  })
  
  if(!flag)
    throw { status: "400", error: `slot not available` };
  //if everything is fine get appointment collection and create a new appointment
  const appointmentCollection = await apCol();

  const newAppointment = {
    doctorId,
    doctorEmail:doctor.email,
    doctorName:doctor.name,
    patientId,
    patientEmail:patient.email,
    patientName:patient.name,
    startTime,
    appointmentDuration: doctor.appointmentDuration,
    appointmentLocation,
    isReminded : false,
    isCompleted : false,
  };

  const insertInfo = await appointmentCollection.insertOne(newAppointment);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    return "Could not add appointment"

  doctor = await doctorData.isDoctorsPatient(doctorId,patientId);
  patient = await patientData.isPatientsDoctor(patientId, doctorId);

  if(!doctor)
    doctor = await doctorData.addMyPatient(doctorId,patientId);
  
  if(!patient)
    patient = await patientData.addMyDoctor(patientId, doctorId);

  const newId = insertInfo.insertedId.toString();
  const appointment = await getAppointmentById(newId);

  email.sendAppointmentConfirmation(appointment);
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
  .find({ doctorId: id , isCompleted : false})
  .toArray();  

  if (!appointments)
    throw { status: "404", error: "No apoointments for doctor with that id" };

  appointments.forEach((a) => {
    a.doctorId = a.doctorId.toString();
    a.patientId = a.patientId.toString();
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
  .find({ patientId: id, isCompleted : false})
  .toArray();  
  // console.log(appointments);
  if (!appointments)
    throw { status: "404", error: "No apointments for patient with that id" };

  appointments.forEach((a) => {
    a.doctorId = a.doctorId.toString();
    a.patientId = a.patientId.toString();
  });


  return appointments;
}

const getAppointmentById = async (id) => {
  //check for id
  id = helper.common.isValidId(id);

  //get all appointments of that doctor
  const appointmentCollection = await apCol();
  const appointment = await appointmentCollection.findOne(
    { _id: ObjectId(id),
      isCompleted : false
     }
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
  email.sendAppointmentCancel(appointment);
  if (deletedAppointment.deletedCount === 1)
    return `Successfully deleted ${id}`;
  else throw { status: "400", error: "Could not delete appointment" };
};

const updateAppointmentById = async (id, data) => {
  //check for id
  id = helper.common.isValidId(id);

  //validate data to update
  data = helper.appointment.validateData(data);

  //get all appointments of that doctor
  let appointmentCollection = await apCol();

  //check if appointment exists
  const appointment = await getAppointmentById(id);
  const doctor = await doctorData.getDoctorById(appointment.doctorId);
  const patient = await patientData.getPatientById(appointment.patientId);
  //if startTime... check startTime
  const slots = await getDoctorSlots(appointment.doctorId, new Date(data.startTime));
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

  const newAppointment = await getAppointmentById(id);

  email.sendAppointmentUpdate(newAppointment);

  return newAppointment;
};

const getDoctorSlots = async (doctorId, date = new Date()) => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const doctor = await doctorData.getDoctorById(doctorId);
  const today = new Date();

  if(date.getDay()>5)
    return [];

  const day = weekDays[date.getDay() - 1];
  const schedule = doctor.schedule[day.toLowerCase()];
  const slotSize = doctor.appointmentDuration;

  if(!schedule)
    return [];
  let slot = [];

  let appointments = await getDoctorAppointments(doctorId);
  appointments = appointments.filter( appointment =>{
    if(new Date(appointment.startTime).getDate() == date.getDate())
      return appointment;
  })
  
  const isAppointmentNotExistInSlot = (startHour, startMinute, endHour, endMinute) => {

    for(let i=0;i<appointments.length;i++)
    {
      const startTime = new Date(appointments[i].startTime)
      const sh = startTime.getHours();
      const sm = startTime.getMinutes();
      const endTime = new Date(startTime.getTime() + 1000*60*appointments[i].appointmentDuration);
      const eh = endTime.getHours();
      const em = endTime.getMinutes();
      if(!(((sh<startHour || (sh===startHour && sm<startMinute)) && (eh<startHour || (eh===startHour && em<=startMinute))) || (sh>endHour || (sh===endHour && sm>=endMinute))))
      {
        return {flag : false, startHour:eh, startMinute:em};
      }
    }
      return {flag : true};
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
      if((startTime[1] + slotSize < 60 && startTime[0]==endTime[0] && startTime[1] + slotSize > endTime[1]) || (startTime[1] + slotSize > 59 && (startTime[0]==endTime[0] || (startTime[0]+parseInt((startTime[1] + slotSize)/60) > endTime[0]) || (startTime[0]+parseInt((startTime[1] + slotSize)/60) == endTime[0] && (startTime[1] + slotSize > 60) && (startTime[1] + slotSize)%60 >= endTime[1])))){
        break;
      }
      if(startTime[1] + slotSize < 60)
      {
        const result = isAppointmentNotExistInSlot(startTime[0], startTime[1], startTime[0], startTime[1] + slotSize);
        if(result.flag === true)
        {
          if(!(today.getDate() === date.getDate() && (startTime[0]<today.getHours() || (startTime[0]===today.getHours() && startTime[1]<today.getMinutes()))))
            slot = [...slot, [startTime[0].toString().padStart(2, '0') + ':' + startTime[1].toString().padStart(2, '0'), startTime[0].toString().padStart(2, '0') + ':' + (startTime[1] + slotSize).toString().padStart(2, '0')]];
          startTime[1] += slotSize;
        }else{
          startTime[0] = result.startHour;
          startTime[1] = result.startMinute;
        } 
      }else{
        const result = isAppointmentNotExistInSlot(startTime[0], startTime[1], startTime[0] + parseInt((startTime[1] + slotSize)/60), (startTime[1] + slotSize)%60);
        if(result.flag === true)
        {
          if(!(today.getDate() === date.getDate() && (startTime[0]<today.getHours() || (startTime[0]===today.getHours() && startTime[1]<today.getMinutes()))))
            slot = [...slot, [startTime[0].toString().padStart(2, '0') + ':' + startTime[1].toString().padStart(2, '0'), (startTime[0] + parseInt((startTime[1] + slotSize)/60)).toString().padStart(2, '0') + ':' + ((startTime[1] + slotSize)%60).toString().padStart(2, '0')]];
          startTime[0] += parseInt((startTime[1] + slotSize)/60);
          startTime[1] = (startTime[1] + slotSize)%60;
        }else{
          startTime[0] = result.startHour;
          startTime[1] = result.startMinute;
        } 
      }
    }
  }
  return slot;
}

const sendAppointmentReminder = async()=>{
  const appointmentCollection = await apCol();
  const allAppointments = await appointmentCollection.find({isReminded: false}).toArray();
  let curTime = new Date();
  curTime = new Date(curTime.getTime() + 60 * 60 * 1000);
  const remindedIds = []
  allAppointments.forEach(appointment => {
    const appointmentTime = new Date(appointment.startTime);
    if(appointmentTime<=curTime)
    {
      email.sendAppointmentReminder(appointment);
      remindedIds.push(appointment._id);
    }
  });
  await appointmentCollection.updateMany(
    { _id: {$in : remindedIds} },
    { $set: {isReminded : true} }
  );
}

const changeAppointmentCompleteStatus = async() =>{
  const appointmentCollection = await apCol();
  const allAppointments = await appointmentCollection.find({isCompleted: false}).toArray();
  const completedIds = []
  const myPatients = {}
  const curTime = new Date();
  allAppointments.forEach(appointment=>{
    startTime = new Date(appointment.startTime);
    endTime = new Date(startTime.getTime() + 1000 * 60 * appointment.appointmentDuration);
    if(endTime<curTime)
    {
      completedIds.push(appointment._id);
      if(!(appointment.doctorId in myPatients))
        myPatients[appointment.doctorId] = [appointment.patientId];
      else
        myPatients[appointment.doctorId].push(appointment.patientId);
    }
  })
  for(let doctor in myPatients){
    await doctorData.changeReviewStatus(doctor,myPatients[doctor],false);
  }
  await appointmentCollection.updateMany(
    { _id: {$in : completedIds} },
    { $set: {isCompleted : true} }
  );
}

const checkAppointmentExist = async(role, userId, apointmentId) =>{
  apointmentId = helper.common.isValidId(apointmentId);
  userId = helper.common.isValidId(userId);
  //get all appointments of that doctor
  const appointmentCollection = await apCol();
  let appointment;
  if(role === 'doctor')
    appointment = await appointmentCollection.findOne(
      { _id: ObjectId(apointmentId),
        doctorId : userId
      }
    );
  else if(role === 'patient')   
    appointment = await appointmentCollection.findOne(
      { _id: ObjectId(apointmentId),
        patientId : userId
      }
    );
  if (!appointment)
    throw { status: "404", error: "No appointment found with that id" };
}
module.exports = {
  createAppointment,
  getDoctorAppointments,
  getPatientAppointment,
  getAppointmentById,
  deleteAppointmentById,
  updateAppointmentById,
  getDoctorSlots,
  sendAppointmentReminder,
  changeAppointmentCompleteStatus,
  checkAppointmentExist
};
