import React, { useState } from "react"
import '../../assets/css/chat.css'
import { styles } from "../../chat/styles"

import { format } from "timeago.js";
import Chat from '../../chat/chat'

export default function Message({message,own}){
  return(
    <div className={own? "message own" : "message"}>
      <div className="messageTop">
           <img
           className="messageImg"
           src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
           alt=""
           />
           <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBottom">
          {format(message.timeStamp)}
      </div>
    </div>
  )
};