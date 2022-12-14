import React from "react"

export default function Message({message,own}){
  const getTime =(time)=>{
    return time.split('T')[0] + " " + time.split('T')[1].split(".")[0]
  }
  return(
    <div className={own? "message own" : "message"}>
      <div className="messageTop">
           <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBottom">
          {getTime(message.timeStamp)}
      </div>
    </div>
  )
};