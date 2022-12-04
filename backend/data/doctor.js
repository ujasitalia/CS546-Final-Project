const helper = require('../helper');
const mongoCollections = require('../config/mongoCollections');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const doctorCol = mongoCollections.doctor;
const commonHelper = require('../helper/common')
const {ObjectId} = require('mongodb');

const isDoctorEmailInDb = async(email) => {
  email=commonHelper.isValidEmail(email).toLowerCase();
  const doctorCollection = await doctorCol();
  const doctorInDb = await doctorCollection.findOne({email:email});
  if (doctorInDb === null) return false;
  return true;
}

const createDoctor = async(
    email,
    profilePicture,
    name,
    speciality,
    clinicAddress,
    city,
    state,
    zip,
    password
    //schedule
) => {
    email = helper.common.isValidEmail(email);
    if(await isDoctorEmailInDb(email)) throw {Status:400,error:'An account already exists with this email'};
    profilePicture = helper.common.isValidFilePath(profilePicture);
    name = helper.common.isValidName(name);
    speciality = helper.doctor.isValidSpeciality(speciality);
    clinicAddress = helper.doctor.isValidAddress(clinicAddress);
    city = helper.common.isValidCity(city);
    state = helper.common.isValidState(state);
    zip = helper.common.isValidZip(zip);
    password = helper.common.isValidPassword(password);
    //schedule = helper.doctor.isValidSchedule(schedule);

    const doctorCollection = await doctorCol();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newDoctor = {
        email,
        profilePicture,
        name,
        speciality,
        clinicAddress,
        city,
        state,
        zip,
        hashedPassword,
        schedule:{},
        rating : 0
      };
  
    const insertInfo = await doctorCollection.insertOne(newDoctor);
  
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw {status: '500', error : 'Could not add doctor'};
  
    const newId = insertInfo.insertedId.toString();
    const doctor = await getDoctorById(newId);
  
    return doctor;
}

const getDoctorById = async(doctorId) =>{
    doctorId = helper.common.isValidId(doctorId);

    const doctorCollection = await doctorCol();
    const doctor = await doctorCollection.findOne({_id: ObjectId(doctorId)}, { projection: { hashedPassword: 0 } });

    if (doctor === null) 
    {
        throw {status: '404', error : 'No doctor with that id'};
    }

    doctor._id = doctor._id.toString();

    return doctor;
}

const getAllDoctor = async () => {
    const doctorCollection = await doctorCol();
    const allDoctors = await doctorCollection.find({}, { projection: { hashedPassword: 0, schedule: 0 } }).toArray();
  
    if (!allDoctors) throw {status: '500', error : 'Could not get all doctors'};
  
    for(let i=0;i<allDoctors.length;i++)
      allDoctors[i]._id = allDoctors[i]._id.toString();
  
    return allDoctors;
  };

  const updateDoctor = async (
    doctorId,
    data
  ) => {
  
    doctorId = helper.common.isValidId(doctorId);
    data = helper.doctor.isValidDoctorData(data);
  
    const doctorCollection = await doctorCol();
    
    await getDoctorById(doctorId);
    
    if(data.password)
    {
      data.hashedPassword = await bcrypt.hash(data.password, saltRounds);
      delete data.password;
    }

    const updatedInfo = await doctorCollection.updateMany(
      {_id: ObjectId(doctorId)},
      {$set: data}
    );
      
    if (updatedInfo.modifiedCount === 0) {
      throw {status: '400', error : 'could not update because values are same as previous one'};
    }
  
    const doctor = await getDoctorById(doctorId);
    return doctor;
  };

  const checkDoctor = async (email, password) => { 
    email=helper.common.isValidEmail(email).toLowerCase();
    password=helper.common.isValidPassword(password);
    const doctorCollection = await doctorCol();
    const doctorInDb = await doctorCollection.findOne({email:email});
    if (doctorInDb === null) throw {status:404,error:'Invalid email or password'};
    else if(await bcrypt.compare(password,doctorInDb.hashedPassword)) return doctorInDb; 
    throw {status:400,error:'Invalid email or password'};
  };
  

module.exports = {
    createDoctor,
    getDoctorById,
    getAllDoctor,
    updateDoctor,
    checkDoctor
};
