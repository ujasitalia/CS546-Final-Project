import React, { useState , useEffect} from "react"
import {api} from '../api';
import '../assets/css/chat.css'
import { useNavigate } from "react-router-dom";

export default function Conversation({conversation,currentUser}){
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() =>{
    const getUser = async()=>{
      const userId = conversation;
      try{
        const res = await api.doctor.getDoctor(userId);
        setUser(res.data);
        setHasError(false);
      }catch(e){
        if(e.response.status===500)
          navigate("/error");
        else if(e.response.status===401 || e.response.status===403)
        {
          localStorage.clear();
          navigate("/login");
        }else{
          setHasError(true);
          setError(e.response.data);
        }
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
    {hasError && <div className="error">{error}</div>}
    </>
  )
}