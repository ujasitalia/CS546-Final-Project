const helper = require('../helper');
const mongoCollections = require('../config/mongoCollections');
const chatCol = mongoCollections.chat;
const {ObjectId} = require('mongodb');
const patient = require('./patient');
const doctor = require('./doctor');

const getAllchat = async (doctorID, patientID) => {
    doctorID = helper.common.isValidId(doctorID);
    patientID = helper.common.isValidId(patientID);

    await doctor.getDoctorById(doctorID);
    await patient.getPatientById(patientID);
    const chatCollection = await chatCol();

    const chatHistory = await chatCollection.find( {$or : [{receiverId: ObjectId(doctorID), senderId: ObjectId(patientID)}, {receiverId: ObjectId(patientID),senderId: ObjectId(doctorID)}] }).toArray();
  
    if (!chatHistory) throw {status: '404', error : 'Could not get chat'};
  
    return chatHistory;
  }

const createChat = async (senderId, receiverId, message) => {
    receiverId = helper.common.isValidId(receiverId);
    senderId = helper.common.isValidId(senderId);
    message = helper.chat.checkMessage(message);
    const timeStamp = Date();

    const newMessage = {
        receiverId : ObjectId(receiverId),
        senderId : ObjectId(senderId),
        message,
        timeStamp
      };
      
    const chatCollection = await chatCol();
    const insertInfo = await chatCollection.insertOne(newMessage);
  
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw {status: '500', error : 'Could not add chat'};
    
    const newId = insertInfo.insertedId.toString();
    const chat = await chatCollection.findOne({_id: ObjectId(newId)});

    if (chat === null) 
        throw {status: '500', error : 'Could not add chat'};
  
    chat._id = chat._id.toString();
  
    return chat;
}

module.exports = {
    getAllchat,
    createChat
};