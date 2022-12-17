import React, { useState , useEffect} from "react"
import { api } from "../api";
import '../assets/css/chat.css'
import { useNavigate } from "react-router-dom";
import userPic from "../assets/images/user.jpg";

export default function Conversation({conversation,currentUser}){
  const [user, setUser] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() =>{
    const getUser = async()=>{
      const userId = conversation;
      try{
        const res = await api.patient.getPatient(userId);
        setUser(res.data);
        setHasError(false);
      }catch(e){
        if(e.response.status===500)
          navigate("/error");
        else if(e.response.status===401 )
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
    {hasError && <div className="error">{error}</div>}
    <div className="people">
      <img className="personProfile"
        src={user && user.profilePicture ? user.profilePicture : userPic}
        alt="N/A"
      />
      <span className="personName">{user?.name}</span>
    </div>
    </>
  )
}