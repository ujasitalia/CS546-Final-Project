const helper = require('../helper');
const mongoCollections = require('../config/mongoCollections');
const chatCol = mongoCollections.chat;
const {ObjectId} = require('mongodb');
const patient = require('./patient');
const doctor = require('./doctor');

const getAllchat = async (doctorID,patientID) => {
    reviewId = helper.common.isValidId(doctorID);
    reviewId = helper.common.isValidId(patientID);

    let doctorData = doctor.getDoctorById(doctorID);
    doctorID = doctorData._id;
    let patientData = patient.getPatientById(patient);
    patientID = patientData._id;
    const chatCollection = await chatCol();

    var chatHistory = await chatCollection.find({receiverId: ObjectId(doctorID),senderId: ObjectId(patientID)}).toArray();
    chatHistory += await chatCollection.find({receiverId: ObjectId(patientID),senderId: ObjectId(doctorID)}).toArray();
  
    if (!chatHistory) throw {status: '404', error : 'Could not get chat'};
  
    return chatHistory;
  };
const createChat = async (senderId,receiverId,message) => {
    receiverId = helper.common.isValidId(receiverId);
    senderId = helper.common.isValidId(senderId);
    message = helper.chat.checkMessage(message);
    timeStamp = Date().valueOf();
    const newMessage = {
        receiverId,
        senderId,
        message,
        timeStamp
      };
    
      const insertInfo = await chatCollection.insertOne(newMessage);
  
      if (!insertInfo.acknowledged || !insertInfo.insertedId)
          throw {status: '500', error : 'Could not add review'};
    
      const newId = insertInfo.insertedId.toString();
      const chat = await chatCollection.findOne({_id: ObjectId(newId)});

      if (chat === null) 
      {
          throw {status: '404', error : 'No chat with that id'};
      }
  
      chat._id = chat._id.toString();
  
      return chat;
}
module.exports = {
    getAllchat,
    createChat
};