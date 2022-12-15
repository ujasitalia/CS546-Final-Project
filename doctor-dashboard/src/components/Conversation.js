import React, { useState , useEffect} from "react"
import { api } from "../api";
import '../assets/css/chat.css'

export default function Conversation({conversation,currentUser}){
  const [user, setUser] = useState(null);

  useEffect(() =>{
    const getUser = async()=>{
      const userId = conversation;
      try{
        const res = await api.patient.getPatient(userId);
        setUser(res.data);
      }catch(e){
        console.log(e);
      }
    };
    getUser();
  },[currentUser,conversation]);
  return (
    <>
    <div className="people">
      <img className="personProfile"
        src={user?.profilePicture}
        alt="N/A"
      />
      <span className="personName">{user?.name}</span>
    </div>
    </>
  )
}