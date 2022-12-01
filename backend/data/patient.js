const mongoCollections = require('../config/mongoCollections');
const patients = mongoCollections.patient;
const bcryptjs = require('bcryptjs');
const patientHelper = require('../helper/patient')
const commonHelper = require('../helper/common')
const {ObjectId} = require('mongodb');

const saltRounds = 10;

const isPatientEmailInDb = async(email) => {
  email=commonHelper.isValidEmail(email).toLowerCase();
  const patientCollection = await patients();
  const patientInDb = await patientCollection.findOne({email:email});
  if (patientInDb == null) 
    return false;
  else 
    return true;
}
  
const createPatient = async (email,age,profilePicture,name,city,state,zip,password) => {
    email=commonHelper.isValidEmail(email).toLowerCase();
    if(await isPatientEmailInDb(email)) throw {status:400,error:'An account already exists with this email'};
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
  if (patient === null) throw {status:404,error:'No patient with that id'};
  patient['_id']=patient['_id'].toString()
  return patient;
};

const updatePatient = async (body,id) => {
  id = commonHelper.isValidId(id);
  let patientInDb = await getPatientById(id);
  if(!patientInDb) throw {status: 404, error: `No patient with that ID`};
  
  body = patientHelper.isValidPatientUpdate(body);
  if(body.password){
    body.hashedPassword = await bcryptjs.hash(body.password,saltRounds);

    delete body.password;
  }
  const patientCollection = await patients();
  const updatedInfo = await patientCollection.updateOne(
    {_id: ObjectId(id)},
    {$set: body}
  );
  if (updatedInfo.modifiedCount === 0) {
    throw 'could not update patient successfully';
  }

  return await getPatientById(id);
}

const checkUser = async (email, password) => { 
  email=commonHelper.isValidEmail(email).toLowerCase();
  password=commonHelper.isValidPassword(password);
  const patientCollection = await patients();
  const patientInDb = await patientCollection.findOne({email:email});
  if (patientInDb === null) throw {status:401,error:'Invalid email or password'};
  else if(await bcryptjs.compare(password,patientInDb.hashedPassword)) return patientInDb; 
  throw {status:401,error:'Invalid email or password'};
};

module.exports = {
  createPatient,
  getPatientById,
  updatePatient,
  checkUser
};