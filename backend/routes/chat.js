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
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
      return;
    }
    
    try{
      const newMessage = await chatData.createChat(data.senderId,data.receiverId,data.message);
      res.json(newMessage);
    }catch(e){
      if(typeof e !== 'object' || !('status' in e) || e.status === '500')
        res.status(500).json(e.error);
      else
        res.status(e.status).json(e.error);
      return;
    }
    
  })

module.exports = router;