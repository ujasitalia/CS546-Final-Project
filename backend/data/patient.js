const mongoCollections = require('../config/mongoCollections');
const patients = mongoCollections.patient;
const bcryptjs = require('bcryptjs');
const patientHelper = require('../helper/patient')
const commonHelper = require('../helper/common')
const {ObjectId} = require('mongodb');

const saltRounds = 10;

const createPatient = async (email,age,profilePicture,name,city,state,zip,password) => {
    email=commonHelper.isValidEmail(email);
    age = patientHelper.isValidAge(age);
    profilePicture=commonHelper.isValidFilePath(profilePicture);
    name=commonHelper.isValidName(name);
    city=commonHelper.isValidCity(city);
    state=commonHelper.isValidState(state);
    zip=commonHelper.isValidZip(zip);
    password=commonHelper.isValidPassword(password);
    
    let hashedPassword = await bcryptjs.hash(password,saltRounds);
    
    let newPatient = {email,age,profilePicture,name,city,state,zip,hashedPassword,medicalHistory:[],prescriptions:[],testReports:[]};
    const patientCollection = await patients(); 
    const insertInfo = await patientCollection.insertOne(newPatient);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw {status:400,error:'Could not add patient'};

    const newPatientId = insertInfo.insertedId.toString();
    return await getPatientById(newPatientId);
}

const getPatientById = async (id) => {
  id = commonHelper.isValidId(id);

  const patientCollection = await patients();
  const patient = await patientCollection.findOne({_id: ObjectId(id)},{projection:{hashedPassword:0}});
  if (patient === null) throw {statusCode:404,error:'No patient with that id'};
  patient['_id']=patient['_id'].toString()
  return patient;
};

module.exports = {
  createPatient,
  getPatientById
};