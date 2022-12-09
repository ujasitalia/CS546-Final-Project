import React, { useState, useEffect} from 'react';
import { api } from '../api';
import arrow from "../assets/images/arrow.svg";
import {helper} from '../helper';

const Availability = (props) => {
  const week = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  const [schedule, setSchedule] = useState(props.doctorSchedule);
  const [slots, setSlots] =  useState({});
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState('');

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
      <div>
        Start Time:
        <select name="hour" id={`${day}-hour-start-${index}`} onChange={handleInputChange}>
        {prev ? getHour(prev[0], end[0]).map(option => {
            if(start[0]===option)
              return (<option value={option} selected> {option} </option>);
            return (<option value={option}> {option} </option>);
        })  
        :
        getHour(8, end[0]).map(option => {
          if(start[0]===option)
            return (<option value={option} selected> {option} </option>);
          return (<option value={option}> {option} </option>);
        })}  
        </select>
        <select name="minute" id={`${day}-minute-start-${index}`} onChange={handleInputChange}>
        {(prev && prev[0]===start[0]) ? getMinute(prev[1]).map(option => {
            if(start[1]===option)
              return (<option value={option} selected> {option} </option>);
            return (<option value={option}> {option} </option>);
        })
        :
        getMinute().map(option => {
          if(start[1]===option)
              return (<option value={option} selected> {option} </option>);
            return (<option value={option}> {option} </option>);
        })}
        </select>  
      </div>
    );
  }

  const getEndTime = (day, index, start, end, next) =>{
    return(
      <div>
        End Time:
        <select name="hour" id={`${day}-hour-end-${index}`} onChange={handleInputChange}>
        {(next) ? getHour(parseInt(start[0]+1),next[0]+1).map(option => {
          if(end[0]===option)
              return (<option value={option} selected> {option} </option>);
          return (<option value={option}> {option} </option>);
        })
        :
        getHour(parseInt(start[0]+1)).map(option => {
          if(end[0]===option)
              return (<option value={option} selected> {option} </option>);
          return (<option value={option}> {option} </option>);
        })}
        {next===undefined && (end[0]===20 ? <option value="20" selected> 20 </option> : <option value="20"> 20 </option>)}  
        </select>
        <select name="minute" id={`${day}-minute-end-${index}`} onChange={handleInputChange}>
        {end[0] === 20 ? <option value="0" selected> 0 </option> : start[0]===end[0] ? getMinute(parseInt(start[1])).map(option => {
          if(end[1]===option)
            return (<option value={option} selected> {option} </option>);
          return (<option value={option}> {option} </option>);
        })
        :
        (next) && (next[0] === end[0]) ? getMinute(0,next[1]+15).map(option => {
          if(end[1]===option)
              return (<option value={option} selected> {option} </option>);
          return (<option value={option}> {option} </option>);
        })
        :
        getMinute().map(option => {
          if(end[1]===option)
              return (<option value={option} selected> {option} </option>);
          return (<option value={option}> {option} </option>);
        })}
        </select>  
      </div>
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
      slot[day[0]].splice(day[2],day[2]+1);
    setSlots(slot);
  }

  const getSchedule = () =>{
    let daysCards = [];
    week.forEach( day => {
      if(slots[day])
      {
        let child = []
        slots[day].map( (slot, index) => {
          const start = slot[0];
          const end = slot[1];
          child.push(
            <div id={`${day}-availability-${index}`}>
              <button type="button" id={`${day}-deleteAvailability-${index}`} onClick={deletAvailability}>Delete Availability</button>
              <br/>
              {slots[day][index-1] ? getStartTime(day, index, start, end, slots[day][index-1][1]) : getStartTime(day, index, start, end)}
              <br/>
              {slots[day][index+1] ? getEndTime(day, index, start, end, slots[day][index+1][0]) : getEndTime(day, index, start, end)}
            </div>
          )
        })
        daysCards.push(<div className={day}>
          {day}
          {child}
          {!(slots[day][slots[day].length-1][0][0]===slots[day][slots[day].length-1][1][0] && slots[day][slots[day].length-1][0][1]===slots[day][slots[day].length-1][1][1])&& slots[day][slots[day].length-1][1][0]!==20 && <button type="button" id={`addSlot-${day}`} onClick={addAvailability}>Add Availability</button>}
        </div>)
      }else{
        daysCards.push(
          <div className={day}>
            {day}
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

  const handleInputChange = (e) => {
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
      for(let index=0;index<slots[day].length;index++)
      {
        if(slots[day][index+1] && slots[day][index][1][0]===slots[day][index+1][0][0] && slots[day][index][1][1]===slots[day][index+1][0][1])
        {
          allAvailability.push([slots[day][index][0][0].toString().padStart(2, '0') + ':' + slots[day][index][0][1].toString().padStart(2, '0'), slots[day][index+1][1][0].toString().padStart(2, '0') + ':' + slots[day][index+1][1][1].toString().padStart(2, '0')]);
          index++;
        }
        else
          allAvailability.push([slots[day][index][0][0].toString().padStart(2, '0') + ':' + slots[day][index][0][1].toString().padStart(2, '0'), slots[day][index][1][0].toString().padStart(2, '0') + ':' + slots[day][index][1][1].toString().padStart(2, '0')]);
      }
      newSchedule[day] = allAvailability;
    }
    return newSchedule;
  }

  const validateSchedule = async (e) =>{
    e.preventDefault();
    let newSchedule = createNewSchedule();
    try
    {
      setSchedule(helper.common.isValidSchedule(newSchedule));
    }catch(e){
      setHasError(true);
      setError(e.message);
      return;
    }
    
    try{
      const data = {schedule:newSchedule}
      const response = await api.doctor.updateDoctor(props.doctorId, data);
      // console.log(response);
      setHasError(false);
      setAvaibility(response.data.schedule);
      props.handleAvailabilityChange(response.data);
    }catch(e){
      setHasError(true);
      console.log(typeof e);
      if(!e.response)
        setError("Error");
      else
        setError(e.response.data);
      return;
    }
  }

  return (
    <div className="scheduleCard">
        <form onSubmit={validateSchedule}>
          {getSchedule()}
            <button type="submit" className="button">
                <div className="buttonBox">
                    <img src={arrow} className="arrow" loading="lazy" alt="logo" />
                </div>
            </button>
        </form>
        {hasError && <div className="error">{error}</div>}
    </div>
  )
}

export default Availability