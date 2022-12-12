const mongoCollections = require('../config/mongoCollections');
const patients = mongoCollections.patient;
const doctors = mongoCollections.doctor;
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
    if(await isPatientEmailInDb(email)) throw {Status:"400",error:'An account already exists with this email'};
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
    throw {status:"400",error:'Could not add patient'};

    const newPatientId = insertInfo.insertedId.toString();
    return await getPatientById(newPatientId);
}

const getPatientById = async (id) => {
  id = commonHelper.isValidId(id);

  const patientCollection = await patients();
  const patient = await patientCollection.findOne({_id: ObjectId(id)},{projection:{hashedPassword:0}});
  if (patient === null) throw {status:"404",error:'No patient with that id'};
  patient['_id']=patient['_id'].toString()
  return patient;
};

const updatePatient = async (body,id) => {
  id = commonHelper.isValidId(id);
  let patientInDb = await getPatientById(id);
  if(!patientInDb) throw {status: "404", error: `No patient with that ID`};
  
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
  if (patientInDb === null) throw {status:"401",error:'Invalid email or password'};
  else if(await bcryptjs.compare(password,patientInDb.hashedPassword)) return patientInDb; 
  throw {status:"401",error:'Invalid email or password'};
};

const getSearchResult = async (data) => {
  data = commonHelper.validateSearchData(data);
  data = data.toLowerCase();
  const doctorCollection = await doctors();
  const allDoctors = await doctorCollection
    .find({}, { projection: { hashedPassword: 0 } })
    .toArray();
  let res = [];
  for (i of allDoctors) {
    if (i.name.toLowerCase().includes(data) || i.specialty.toLowerCase().includes(data)){
      res.push(i);
    }
  }
  if (!res) throw { status: "404", error: "No match found." };
  // console.log(res);
  return res;
};

const getFilterResult = async (data) => {
  data = commonHelper.isValidString(data);
  data = data.toLowerCase();
  const doctorCollection = await doctors();
  const allDoctors = await doctorCollection
    .find({}, { projection: { hashedPassword: 0 } })
    .toArray();
  let res = [];
  for (i of allDoctors) {
    if (i.specialty.toLowerCase() === data ){
      res.push(i);
    }
  }
  if (!res) throw { status: "404", error: "No match found." };
  return res;
};


const updateMedicalHistory = async (patientId,disease, startDate) => {
  
  patientId = commonHelper.isValidId(patientId);
  disease = commonHelper.isValidString(disease);
  startDate = commonHelper.isValidTime(startDate);
  /*
  if(endDate !== null){
    endDate = commonHelper.isValidTime(endDate);
  }*/

  const patientCollection = await patients();
  const patient = await patientCollection.getPatientById(patientId);
  //let newMedicalHistory = {disease,startDate,endDate};
  let newMedicalHistory = {disease,startDate};

  const updatePatient = await patientCollection.updateOne({_id: ObjectId(patientId)},{$push:{medicalHistory: newMedicalHistory}});

  if (updatePatient.modifiedCount === 0) throw "Error: Could not add Medical History";

  const updatedPatient = await getPatientById(patientId);
  return updatedPatient;
  
};

const getMedicalHistory = async (id) => {

  id = commonHelper.isValidId(id);
  const patientCollection = await patients();
  const patient = await patientCollection.getPatientById(id);
  let medicalHistoryList=[];
  for(let i=0;i<patient.medicalHistory.length;i++){
    medicalHistoryList.push(patient.medicalHistory[i]);
  }
  return medicalHistoryList;

};

const updateTestReport = async (patientId, testName, testDocument) => {

  patientId = commonHelper.isValidId(patientId);
  testName = commonHelper.isValidString(testName);
  testDocument = commonHelper.isValidFilePath(testDocument);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;
  testDate = today.toString();

  const patientCollection = await patients();
  const patient = await patientCollection.getPatientById(patientId);
  let newTestReports = {testName,testDocument,testDate};

  const updatePatient = await patientCollection.updateOne({_id: ObjectId(patientId)},{$push:{testReports: newTestReports}});

  if (updatePatient.modifiedCount === 0) throw "Error: Could not add Medical History";

  const updatedPatient = await getPatientById(patientId);
  return updatedPatient;
};

const getTestReport = async(id) => {
  id = commonHelper.isValidId(id);
  const patientCollection = await patients();
  const patient = await patientCollection.getPatientById(id);
  let testReportList=[];
  for(let i=0;i<patient.testReports.length;i++){
    testReportList.push(patient.testReports[i]);
  }
  return testReportList;
};


const getPatientPrescription = async(id) => {
  id = commonHelper.isValidId(id);
  const patientCollection = await patients();
  const patient = await patientCollection.getPatientById(id);
  let patientPrescriptionList=[];
  for(let i=0;i<patient.prescription.length;i++){
    patientPrescriptionList.push(patient.prescriptions[i]);
  }
  return patientPrescriptionList;
};



module.exports = {
  createPatient,
  getPatientById,
  updatePatient,
  checkUser,
  getSearchResult,
  getFilterResult,
  updateMedicalHistory,
  getMedicalHistory,
  updateTestReport,
  getTestReport,
  getPatientPrescription
};