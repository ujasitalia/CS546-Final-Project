const helper = require('../helper');
const mongoCollections = require('../config/mongoCollections');
const chatCol = mongoCollections.chat;
const {ObjectId} = require('mongodb');
const patient = require('./patient');
const doctor = require('./doctor');

const getAllchat = async (doctorId, patientId) => {
    doctorId = helper.common.isValidId(doctorId);
    patientId = helper.common.isValidId(patientId);

    await doctor.getDoctorById(doctorId);
    await patient.getPatientById(patientId);
    const chatCollection = await chatCol();

    const chatHistory = await chatCollection.find( {$or : [{receiverId: ObjectId(doctorId), senderId: ObjectId(patientId)}, {receiverId: ObjectId(patientId),senderId: ObjectId(doctorId)}] }).toArray();
  
    if (!chatHistory) throw {status: '404', error : 'Could not get chat'};
  
    return chatHistory;
  }

  const getPeople = async (userId) => {
    userId = helper.common.isValidId(userId);
    const chatCollection = await chatCol();

    const chatHistory = await chatCollection.find( {$or : [{receiverId: ObjectId(userId)}, {senderId: ObjectId(userId)}] }).toArray();
    let people = [];
    for(var message in chatHistory){
        if(chatHistory[message].senderId.toString() == userId.toString()){
            if(!people.includes(chatHistory[message].receiverId.toString())){
            people.push(chatHistory[message].receiverId.toString());
            }
        }
        if(chatHistory[message].receiverId.toString() == userId.toString()){
            if(!people.includes(chatHistory[message].senderId.toString())){
            people.push(chatHistory[message].senderId.toString());
            }
        }
    }
    if (people.length ==0) throw {status: '404', error : 'Could not get chat history'};
    return people;
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
    createChat,
    getPeople
};