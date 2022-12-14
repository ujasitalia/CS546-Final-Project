const helper = require('../helper');
const mongoCollections = require('../config/mongoCollections');
const patients = mongoCollections.patient;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const doctorCol = mongoCollections.doctor;
const documentCol = mongoCollections.document
const commonHelper = require('../helper/common')
const {ObjectId} = require('mongodb');
const { getPatientById, getPatientPrescription } = require('./patient');
const { isValidMedicine } = require('../helper/doctor');

const isDoctorEmailInDb = async(email) => {
  email=commonHelper.isValidEmail(email).toLowerCase();
  const doctorCollection = await doctorCol();
  const doctorInDb = await doctorCollection.findOne({email:email});
  if (doctorInDb === null) return false;
  return true;  
}

const isDoctorNpiInDb = async(npi) => {
  npi=helper.doctor.isValidNpi(npi);
  const doctorCollection = await doctorCol();
  const doctorInDb = await doctorCollection.findOne({npi:npi});
  if (doctorInDb === null) return false;
  return true;  
}


const createDoctor = async(
    npi,
    email,
    name,
    speciality,
    clinicAddress,
    zip,
    password,
    link,
) => {
    email = helper.common.isValidEmail(email);
    if(await isDoctorEmailInDb(email)) throw {status:400,error:'An account already exists with this email'};
    npi=helper.doctor.isValidNpi(npi);
    if(await isDoctorNpiInDb(npi)) throw {status:400,error:'An account already exists with this NPI'};
    name = helper.common.isValidName(name);
    speciality = helper.doctor.isValidSpeciality(speciality);
    clinicAddress = helper.doctor.isValidAddress(clinicAddress);
    zip = helper.common.isValidZip(zip);
    password = helper.common.isValidPassword(password);
    link = helper.common.isValidLink(link);

    const doctorCollection = await doctorCol();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newDoctor = {
        npi,
        email,
        profilePicture: "",
        name,
        speciality,
        clinicAddress,
        zip,
        hashedPassword,
        schedule:{},
        appointmentDuration : 30,
        rating : 0,
        link,
        myPatients : []
      };
  
    const insertInfo = await doctorCollection.insertOne(newDoctor);
  
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw {status: '400', error : 'Could not add doctor'};
  
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
  
    if (!allDoctors) throw {status: '400', error : 'Could not get all doctors'};
  
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

  const addMyPatient = async(doctorId, patientId) =>{
    doctorId = helper.common.isValidId(doctorId);
    patientId = helper.common.isValidId(patientId);
    const doctorCollection = await doctorCol();
    const updatedInfo = await doctorCollection.updateOne({_id: ObjectId(doctorId)},{$push:{myPatients: [patientId, true]}});
    if (updatedInfo.modifiedCount === 0) {
      throw {status: '400', error : 'could not update because values are same as previous one'};
    }
    const doctor = await getDoctorById(doctorId);
    return doctor;
  }

  const checkDoctor = async (email, password) => { 
    email=helper.common.isValidEmail(email).toLowerCase();
    password=helper.common.isValidPassword(password);
    const doctorCollection = await doctorCol();
    const doctorInDb = await doctorCollection.findOne({email:email});
    if (doctorInDb === null) throw {status:404,error:'Invalid email or password'};
    else if(await bcrypt.compare(password,doctorInDb.hashedPassword)) return doctorInDb; 
    throw {status:400,error:'Invalid email or password'};
  };
  
  const addPrescription = async(doctorId,patientId,disease,medicine,prescriptionDocument,doctorSuggestion) => {
    patientId = commonHelper.isValidId(patientId);
    doctorId = commonHelper.isValidId(doctorId);
    disease=commonHelper.isValidString(disease);
    medicine=isValidMedicine(medicine);
    prescriptionDocument=commonHelper.isValidFilePath(prescriptionDocument);
    doctorSuggestion=commonHelper.isValidString(doctorSuggestion);

    const patientCollection = await patients();
    const patient = await getPatientById(patientId);
    if(!patient) throw {status: "404", error: `No patient with that ID`};

    const documentCollection = await documentCol();
    const document = await documentCollection.insertOne({document:prescriptionDocument});
    let newPrescription = {prescriptionId: new ObjectId(),doctorId,disease,medicine,prescriptionDocument:document.insertedId.toString(),doctorSuggestion};
    const updatePatient = await patientCollection.updateMany({_id: ObjectId(patientId)},{$push:{prescriptions: newPrescription}});

    if (updatePatient.modifiedCount === 0) throw "Error: Could not add prescription";

    const UpdatedPrescription = await getPatientPrescription(patientId);
    return UpdatedPrescription;
  }

  const updatePrescription = async (patientId,prescriptionId,disease,medicine,prescriptionDocument,doctorSuggestion) => {
    
    patientId = commonHelper.isValidId(patientId);
    //doctorId = commonHelper.isValidId(doctorId);
    prescriptionId = commonHelper.isValidId(prescriptionId);
    disease=commonHelper.isValidString(disease);
    medicine=isValidMedicine(medicine);
    prescriptionDocument=commonHelper.isValidFilePath(prescriptionDocument);
    doctorSuggestion=commonHelper.isValidString(doctorSuggestion);

    let patientInDb = await getPatientById(patientId);
    if(!patientInDb) throw {status: "404", error: `No patient with that ID`};
    
    const patientCollection = await patients();
    let prescriptionInDb = patientInDb.prescriptions;
    //let newMedicalHistory = [];
    const documentCollection = await documentCol();
    let doc;
    for(let i=0;i<prescriptionInDb.length;i++){
      if(prescriptionInDb[i].prescriptionId==prescriptionId) {
        doc = await documentCollection.updateOne(
          {_id:ObjectId(prescriptionInDb[i].prescriptionDocument)}, 
            {$set: {document:prescriptionDocument}});
        prescriptionInDb[i].disease=disease;
        prescriptionInDb[i].medicine=medicine;
        prescriptionInDb[i].doctorSuggestion=doctorSuggestion;
        break;
      }
    }
    patientInDb.prescriptions=prescriptionInDb;
    const updatedInfo = await patientCollection.updateOne(
      {_id: ObjectId(patientId)},
      {$set: {prescriptions:prescriptionInDb}}
    );
    if (updatedInfo.modifiedCount === 0 && doc.modifiedCount === 0) throw {status: "404", error: "No changes made to the prescription"};

    const UpdatedPrescription = await getPatientPrescription(patientId);
    return UpdatedPrescription;
  }
  
const isDoctorsPatient = async(doctorId, patientId) =>{
  const doctorCollection = await doctorCol();
  const doctorInDb = await doctorCollection.findOne({_id:ObjectId(doctorId), myPatients: {$elemMatch:{$elemMatch:{$in:[patientId]}}}});
  return doctorInDb;
}

const canPatientGiveReview = async(doctorId, patientId) =>{
  const doctorCollection = await doctorCol();
  const doctorInDb = await doctorCollection.findOne({_id:ObjectId(doctorId), myPatients: {$all:[[patientId, false]]}});
  return doctorInDb;
}

const changeReviewStatus = async(doctorId, patientIds, flag) =>{
  const doctorCollection = await doctorCol();
  const doctorInDb = await doctorCollection.findOne({_id:ObjectId(doctorId)});
  const myPatients = []
  doctorInDb.myPatients.forEach( element => {
    if(patientIds.includes(element[0]))
    myPatients.push([element[0], flag])
    else return myPatients.push([element[0], element[1]]);
  })
  const updatedInfo = await doctorCollection.updateMany({_id:ObjectId(doctorId)}, {$set: {myPatients : myPatients}});
  return updatedInfo;
}

module.exports = {
    createDoctor,
    getDoctorById,
    getAllDoctor,
    updateDoctor,
    checkDoctor,
    updatePrescription,
    addPrescription,
    addMyPatient,
    checkDoctor,
    isDoctorsPatient,
    changeReviewStatus,
    canPatientGiveReview
};
