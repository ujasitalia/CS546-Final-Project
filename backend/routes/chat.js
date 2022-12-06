const express = require('express');
const router = express.Router();
const data = require("../data");
const helper = require('../helper');
const chatData = data.chat;
router
  .route('/')
  .post(async (req, res) => {
    const data = req.body;
    try{
      data.senderId = helper.common.isValidId(data.senderId);
      data.receiverId = helper.common.isValidId(data.receiverId);
      data.message = helper.chat.checkMessage(data.message);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    
    try{
      const newMessage = await chatData.createChat(data.senderId,data.receiverId,data.message);
      res.json(newMessage);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  })
  
  router
  .route('/:doctorId/:patientId')
  .get(async (req, res) => {
    const data = req.body;
    try{
      data.patientId = helper.common.isValidId(req.params.patientId);
      data.doctorId = helper.common.isValidId(req.params.doctorId);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    
    try{
      const chatHistory = await chatData.getAllchat(req.params.doctorId, req.params.patientId);
      res.json(chatHistory);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  });

  router
  .route('/:id')
  .get(async (req, res) => {
    let id;
    try{
      id = helper.common.isValidId(req.params.id);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
    
    try{
      const people = await chatData.getPeople(id);
      res.json(people);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e))
        res.status(500).json(e);
      else
        res.status(parseInt(e.status)).json(e.error);
      return;
    }
  });
module.exports = router;