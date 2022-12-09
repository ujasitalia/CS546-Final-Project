import React, { useState , useEffect} from "react"
import axios from 'axios'
import '../../assets/css/chat.css'
import { styles } from "../../chat/styles"

import { format } from "timeago.js";
import Chat from '../../chat/chat'

export default function Message({message,own}){
  const [user, setUser] = useState(null);

  useEffect(() =>{
    const getUser = async()=>{
      const userId = message.senderId;
      let res;
      try{
        if(own){
           res = await axios("http://localhost:3000/patient/"+userId);
        }else{
           res = await axios("http://localhost:3000/doctor/"+userId);
        }
        setUser(res.data);
      }catch(e){
        console.log(e);
      }
    };
    getUser();
  },[]);
  return(
    <div className={own? "message own" : "message"}>
      <div className="messageTop">
           <img
           className="messageImg"
             src={user?.profilePicture}
             alt="N/A"
           />
           <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBottom">
          {format(message.timeStamp)}
      </div>
    </div>
  )
};