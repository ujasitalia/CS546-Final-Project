const mongoCollections = require('../config/mongoCollections');
const patients = mongoCollections.patient;
const bcryptjs = require('bcryptjs');
const patientHelper = require('../helper/patient')
const commonHelper = require('../helper/common')
const {ObjectId} = require('mongodb');

const saltRounds = 10;

const createPatient = async (patientId,email,age,profilePicture,name,city,state,zip,password) => {
    let hashedPassword = await bcryptjs.hash(password,saltRounds);
    patientHelper.isValidAge(age);

    let newPatient = {patientId,email,age,profilePicture,name,city,state,zip,hashedPassword,medicalHistory:[],prescriptions:[],testReports:[]};
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
  const patient = await patientCollection.findOne({_id: ObjectId(id)});
  if (patient === null) throw {statusCode:404,error:'No patient with that id'};
  patient['_id']=patient['_id'].toString()
  return patient;
};

module.exports = {
  createPatient,
  getPatientById
};