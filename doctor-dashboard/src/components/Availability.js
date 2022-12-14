import React, { useState, useEffect} from 'react';
import { api } from '../api';
import arrow from "../assets/images/arrow.svg";
import {helper} from '../helper';
import { useNavigate } from "react-router-dom";

const Availability = (props) => {
  const week = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const [schedule, setSchedule] = useState(props.doctorSchedule);
  const [appointmentDuration, setAppointmentDuration] = useState(props.appointmentDuration);
  const [slots, setSlots] =  useState({});
  const [hasSuccessMessage, setHasSuccessMessage] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    if(slots)
    {
      setAvaibility(schedule);
    }
  },[]);

  const setAvaibility=(schedule)=>{
    let slot = {}
      for(let day in schedule)
      {
        let slt = [];
        schedule[day].forEach(element => {
          slt.push([[parseInt(element[0].split(":")[0]), parseInt(element[0].split(":")[1])],[parseInt(element[1].split(":")[0]), parseInt(element[1].split(":")[1])]])
        });
        slot[day] =slt;
      }
      setSlots(slot);
  }

  const getStartTime = (day, index, start, end, prev) =>{
    return(
      <>
        Start Time:
        <select name="hour" id={`${day}-hour-start-${index}`} onChange={handleInputChange} value={start[0]}>
        {prev ? getHour(prev[0], end[0]).map((option, index) => {
            return (<option value={option} key={index}> {option} </option>);
        })  
        :
        getHour(8, end[0]).map((option, index) => {
          return (<option value={option} key={index}> {option} </option>);
        })}  
        </select>
        <select name="minute" id={`${day}-minute-start-${index}`} onChange={handleInputChange} value={start[1]}>
        {(prev && prev[0]===start[0]) ? getMinute(prev[1]).map((option, index) => {
            return (<option value={option} key={index}> {option} </option>);
        })
        :
        getMinute().map((option, index) => {
            return (<option value={option} key={index}> {option} </option>);
        })}
        </select>  
      </>
    );
  }

  const getEndTime = (day, index, start, end, next) =>{
    return(
      <>
        End Time:
        <select name="hour" id={`${day}-hour-end-${index}`} onChange={handleInputChange} value={end[0]}>
        {(next) ? getHour(parseInt(start[0]+1),next[0]+1).map((option, index) => {
          return (<option value={option} key={index}> {option} </option>);
        })
        :
        getHour(parseInt(start[0]+1)).map((option, index) => {
          return (<option value={option} key={index}> {option} </option>);
        })}
        {next===undefined && <option value="20"> 20 </option>}  
        </select>
        <select name="minute" id={`${day}-minute-end-${index}`} onChange={handleInputChange} value={end[0] === 20 ? 0 : end[1]}>
        {end[0] === 20 ? <option value="0"> 0 </option> : start[0]===end[0] ? getMinute(parseInt(start[1])).map((option, index) => {
          return (<option value={option} key={index}> {option} </option>);
        })
        :
        (next) && (next[0] === end[0]) ? getMinute(0,next[1]+15).map((option, index) => {
          return (<option value={option} key={index}> {option} </option>);
        })
        :
        getMinute().map((option, index) => {
          return (<option value={option} key={index}> {option} </option>);
        })}
        </select>  
      </>
    );
  }

  const addAvailability = (e) =>{
    let day = e.target.id.split("-");
    let slot = {...slots};
    if(!slot[day[1]])
      slot[day[1]]=[[[8,0],[20,0]]];
    else
      slot[day[1]].push([[slot[day[1]][slot[day[1]].length-1][1][0],slot[day[1]][slot[day[1]].length-1][1][1]],[20,0]]);
    setSlots(slot);
  }

  const deletAvailability = (e) =>{
    let day = e.target.id.split("-");
    let slot = {...slots};
    if(slot[day[0]].length===1)
      delete slot[day[0]];
    else
      slot[day[0]].splice(day[2], 1);
    setSlots(slot);
  }

  const getSchedule = () =>{
    let daysCards = [];
    week.map( (day, index) => {
      if(slots[day])
      {
        let child = slots[day].map( (slot, index) => {
          const start = slot[0];
          const end = slot[1];
          return (
            <div id={`${day}-availability-${index}`}  key={index}>
              {slots[day][index-1] ? getStartTime(day, index, start, end, slots[day][index-1][1]) : getStartTime(day, index, start, end)}
              {slots[day][index+1] ? getEndTime(day, index, start, end, slots[day][index+1][0]) : getEndTime(day, index, start, end)}
              <button type="button" id={`${day}-deleteAvailability-${index}`} onClick={deletAvailability}>Delete Availability</button>
            </div>
          )
        })
        daysCards.push(<div className={day} key={index}>
          {day + " : "}
          {child}
          {!(slots[day][slots[day].length-1][0][0]===slots[day][slots[day].length-1][1][0] && slots[day][slots[day].length-1][0][1]===slots[day][slots[day].length-1][1][1])&& slots[day][slots[day].length-1][1][0]!==20 && <button type="button" id={`addSlot-${day}`} onClick={addAvailability}>Add Availability</button>}
        </div>)
      }else{
        daysCards.push(
          <div className={day} key={index}>
            {day + " : "}
            <div>No Availability</div>
            <button type="button" id={`addSlot-${day}`} onClick={addAvailability}>Add Availability</button>
          </div>
        )
      }
    })
    return daysCards;
  }

  const getHour = (limit=8, up=20) =>{
    let hour = [];
    for(let i=limit;i<up;i++)
      hour.push(i);
    return hour;
  }

  const getMinute = (limit=0, up=60) =>{
    let minute = [];
    for(let i=limit;i<up;i=i+15)
      minute.push(i);
    return minute;
  }

  const getAppointmentDurations = () =>{
    let durations = [];
    for(let i=15;i<91;i+=15)
      durations.push(i);
    return durations;
  }

  const handleInputChange = (e) => {
    if(hasSuccessMessage)
      setHasSuccessMessage(false);
    if(hasError)
      setError(false);
    if(e.target.id === "appointmentDurations")
    {
      setAppointmentDuration(e.target.value);
      return;
    }
    let slot = {...slots};
    let change  = e.target.id.split("-");
    if(change[2]==="start")
    {
      if(change[1]==="hour")
      {
        slot[change[0]][change[3]][0][0] = parseInt(e.target.value);
        if(slot[change[0]][parseInt(change[3])-1] && slot[change[0]][parseInt(change[3])-1][1][0]===slot[change[0]][parseInt(change[3])][0][0] && slot[change[0]][parseInt(change[3])-1][1][1]>slot[change[0]][parseInt(change[3])][0][1])
          slot[change[0]][parseInt(change[3])][0][1] = slot[change[0]][parseInt(change[3])-1][1][1];
      }
      else
        slot[change[0]][change[3]][0][1] = parseInt(e.target.value);
    }
    else{
      if(change[1]==="hour"){
        slot[change[0]][change[3]][1][0] = parseInt(e.target.value);
        if(slot[change[0]][parseInt(change[3])+1] && slot[change[0]][parseInt(change[3])+1][0][0]===slot[change[0]][parseInt(change[3])][1][0] && slot[change[0]][parseInt(change[3])+1][0][1]<slot[change[0]][parseInt(change[3])][1][1])
          slot[change[0]][change[3]][1][1] = slot[change[0]][parseInt(change[3])+1][0][1];
        if(slot[change[0]][change[3]][1][0]===20)
          slot[change[0]][change[3]][1][1] = 0;
      }
      else
        slot[change[0]][change[3]][1][1] = parseInt(e.target.value);
    }
    setSlots(slot);
  }

  const createNewSchedule = () =>{
    let newSchedule = {};
    for(let day in slots){
      let allAvailability = [];
      for(let i=0;i<slots[day].length;i++)
      {
        let index=i;
        while(slots[day][index+1] && slots[day][index][1][0]===slots[day][index+1][0][0] && slots[day][index][1][1]===slots[day][index+1][0][1])
        {
          index++;
        }
        if(index===i)
          allAvailability.push([slots[day][index][0][0].toString().padStart(2, '0') + ':' + slots[day][index][0][1].toString().padStart(2, '0'), slots[day][index][1][0].toString().padStart(2, '0') + ':' + slots[day][index][1][1].toString().padStart(2, '0')]);
        else
          allAvailability.push([slots[day][i][0][0].toString().padStart(2, '0') + ':' + slots[day][i][0][1].toString().padStart(2, '0'), slots[day][index][1][0].toString().padStart(2, '0') + ':' + slots[day][index][1][1].toString().padStart(2, '0')]);
        i=index;
      }
      newSchedule[day] = allAvailability;
    }
    return newSchedule;
  }

  const validateSchedule = async (e) =>{
    e.preventDefault();
    let newSchedule = createNewSchedule();
    let duration;
    try
    {
      duration = helper.common.isValidAppointmentDuration(appointmentDuration)
      setAppointmentDuration(duration);
      setSchedule(helper.common.isValidSchedule(newSchedule));
    }catch(e){
      setHasError(true);
      setError(e.message);
      return;
    }
    
    try{
      const data = {schedule:newSchedule, appointmentDuration:duration}
      const response = await api.doctor.updateDoctor(props.doctorId, data);
      setHasError(false);
      setHasSuccessMessage(true);
      setAvaibility(response.data.schedule);
      props.handleAvailabilityChange(response.data);
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
  }

  return (
    <div className="scheduleCard">
        {hasSuccessMessage && <div className='successMessage'>Successfully updated</div>}
        {hasError && <div className="error">{error}</div>}
        <br/>
        <form onSubmit={validateSchedule}>
        <label htmlFor='appointmentDurations'>Appointment Duration : </label>
        <select name='appointmentDurations' id='appointmentDurations' value={appointmentDuration} onChange={handleInputChange}>
            {getAppointmentDurations().map((element, index)=>{
              return <option value={element} key={index}> {element} </option>
            })}
        </select>
        <br/>
        <br/>
        <span>
            Schedule : 
        </span>
          {getSchedule()}
          <br/>
            <button type="submit" className="button">Submit
            </button>
        </form>
    </div>
  )
}

export default Availability