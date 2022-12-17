const fs = require('fs');
const mongoCollections = require('./config/mongoCollections');
const doctorCol = mongoCollections.doctor;
const patientCol = mongoCollections.patient;
const reviewCol = mongoCollections.review;
const appointmentCol = mongoCollections.appointment;
const chatCol = mongoCollections.chat;
const documentCol = mongoCollections.document;
const doctor = require("./dbFile/doctor");
const patient = require("./dbFile/patient");
const review = require("./dbFile/review");
const appointment = require("./dbFile/appointment");
const chat = require("./dbFile/chat");
const document = require("./dbFile/document");

const importDoctorData = async () => {
  try {
    const doctorCollection = await doctorCol();
    await doctorCollection.insertMany(doctor);
    console.log('Doctor data successfully imported')
    process.exit();
  } catch (error) {
    console.log('error', error);
    process.exit();
  }
}

const importPatientData = async () => {
    try {
      const patientCollection = await patientCol();
      await patientCollection.insertMany(patient);
      console.log('Doctor data successfully imported')
      process.exit();
    } catch (error) {
      console.log('error', error);
      process.exit();
    }
}

const importReviewData = async () => {
    try {
      const reviewCollection = await reviewCol();
      await reviewCollection.insertMany(review);
      console.log('Doctor data successfully imported')
      process.exit();
    } catch (error) {
      console.log('error', error);
      process.exit();
    }
}

const importAppointmentData = async () => {
    try {
      const appointmentCollection = await appointmentCol();
      await appointmentCollection.insertMany(appointment);
      console.log('Doctor data successfully imported')
      process.exit();
    } catch (error) {
      console.log('error', error);
      process.exit();
    }
}

const importChatData = async () => {
    try {
      const chatCollection = await chatCol();
      await chatCollection.insertMany(chat);
      console.log('Doctor data successfully imported')
      process.exit();
    } catch (error) {
      console.log('error', error);
      process.exit();
    }
}

const importDocumentData = async () => {
    try {
      const documentCollection = await documentCol();
      await documentCollection.insertMany(document);
      console.log('Doctor data successfully imported')
      process.exit();
    } catch (error) {
      console.log('error', error);
      process.exit();
    }
}

importDoctorData();
importPatientData();
importReviewData();
importAppointmentData();
importChatData();
importDocumentData();