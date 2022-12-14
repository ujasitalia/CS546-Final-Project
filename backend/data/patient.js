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

const addMedicalHistory = async (patientId,disease, startDate, endDate) => {
  
  patientId = commonHelper.isValidId(patientId);
  disease = commonHelper.isValidString(disease);
  startDate = commonHelper.isValidPastDate(startDate)
  
  if(endDate !== null){
    endDate = commonHelper.isValidPastDate(endDate)
    if(endDate < startDate) throw {status:'400', error:'Start date must be before the end date'}
    endDate = endDate.toISOString().split('Z')[0];
  }
  startDate = startDate.toISOString().split('Z')[0];

  //console.log(typeof startDate)
  const patientCollection = await patients();
  let patientInDb = await getPatientById(patientId);
  if(!patientInDb) throw {status: "404", error: `No patient with that ID`};
  let newMedicalHistory = {medicalHistoryId: new ObjectId(),disease,startDate,endDate};
  //let newMedicalHistory = {disease,startDate};

  const updatePatient = await patientCollection.updateOne({_id: ObjectId(patientId)},{$push:{medicalHistory: newMedicalHistory}});

  if (updatePatient.modifiedCount === 0) throw "No changes made to the Medical History";

  const updatedPatient = await getPatientById(patientId);
  return updatedPatient;
};

const updateMedicalHistory = async (patientId,medicalHistoryId,disease, startDate, endDate) => {
  
  patientId = commonHelper.isValidId(patientId);
  medicalHistoryId = commonHelper.isValidId(medicalHistoryId);
  disease = commonHelper.isValidString(disease);
  startDate = commonHelper.isValidPastDate(startDate);
  
  if(endDate !== null){
    endDate = commonHelper.isValidPastDate(endDate)
    if(endDate < startDate) throw {status:'400', error:'Start date must be before the end date'}
    endDate = endDate.toISOString().split('Z')[0];
  }
  startDate = startDate.toISOString().split('Z')[0];

  const patientCollection = await patients();
  let patientInDb = await getPatientById(patientId);
  if(!patientInDb) throw {status: "404", error: `No patient with that ID`};
  // let newMedicalHistory = {medicalHistoryId: new ObjectId(),disease,startDate,endDate};
  //let newMedicalHistory = {disease,startDate};
  let medicalHistoryInDb = patientInDb.medicalHistory;
  //let newMedicalHistory = [];
  for(let i=0;i<medicalHistoryInDb.length;i++){
    if(medicalHistoryInDb[i].medicalHistoryId==medicalHistoryId) {
      medicalHistoryInDb[i].disease=disease;
      medicalHistoryInDb[i].startDate=startDate;
      medicalHistoryInDb[i].endDate=endDate;
    }
  
  }
  patientInDb.medicalHistory=medicalHistoryInDb;
  const updatedInfo = await patientCollection.updateOne(
    {_id: ObjectId(patientId)},
    {$set: {medicalHistory:medicalHistoryInDb}}
  );
  if (updatedInfo.modifiedCount === 0) throw "No changes made to the Medical History";

  const updatedPatient = await getPatientById(patientId);
  return updatedPatient;
  
};

const updateTestReport = async (patientId,testReportId,testName, testDate, document) => {
  
  patientId = commonHelper.isValidId(patientId);
  testReportId = commonHelper.isValidId(testReportId);
  testName = commonHelper.isValidString(testName);
  testDate = commonHelper.isValidPastDate(testDate);
  
  const patientCollection = await patients();
  let patientInDb = await getPatientById(patientId);
  if(!patientInDb) throw {status: "404", error: `No patient with that ID`};
  //let newMedicalHistory = {medicalHistoryId: new ObjectId(),disease,startDate,endDate};
  //let newMedicalHistory = {disease,startDate};

  let testReportsInDb = patientInDb.testReports;
  //let newMedicalHistory = [];
  for(let i=0;i<testReportsInDb.length;i++){
    if(testReportsInDb[i].testReportId==testReportId) {
      testReportsInDb[i].testName=testName;
      testReportsInDb[i].document=document;
      testReportsInDb[i].testDate=testDate;
    }
  
  }
  patientInDb.testReports=testReportsInDb;
  const updatedInfo = await patientCollection.updateOne(
    {_id: ObjectId(patientId)},
    {$set: {testReports:testReportsInDb}}
  );

  if (updatedInfo.modifiedCount === 0) throw "No changes made to the Test Report";

  const updatedPatient = await getPatientById(patientId);
  return updatedPatient;
  
};

const getMedicalHistory = async (id) => {

  id = commonHelper.isValidId(id);
  const patient = await getPatientById(id);
  return patient.medicalHistory;

};

const addTestReport = async (patientId, testName, testDocument, testDate) => {

  patientId = commonHelper.isValidId(patientId);
  testName = commonHelper.isValidString(testName);
  testDocument = commonHelper.isValidFilePath(testDocument);
  testDate = commonHelper.isValidPastDate(testDate);

  var today = new Date(testDate);
  // var dd = String(today.getDate()).padStart(2, '0');
  // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  // var yyyy = today.getFullYear();

  // today = mm + '/' + dd + '/' + yyyy;
  testDate = today.toISOString().split('Z')[0];

  const patientCollection = await patients();
  let patientInDb = await getPatientById(patientId);
  if(!patientInDb) throw {status: "404", error: `No patient with that ID`};
  let newTestReports = {testReportId: new ObjectId(), testName,testDocument,testDate};

  const updatePatient = await patientCollection.updateOne({_id: ObjectId(patientId)},{$push:{testReports: newTestReports}});

  if (updatePatient.modifiedCount === 0) throw "Error: No changes made to test reports";

  const updatedPatient = await getPatientById(patientId);
  return updatedPatient;
};

const getTestReport = async(id) => {
  id = commonHelper.isValidId(id);
  const patient = await getPatientById(id);
 return patient.testReports;
};


const getPatientPrescription = async(id) => {
  id = commonHelper.isValidId(id);
  const patient = await getPatientById(id);
  return patient.prescriptions;
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
  getPatientPrescription,
  addMedicalHistory,
  addTestReport
};