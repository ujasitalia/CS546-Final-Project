import { specialities } from "./constants";

export const isValidString = (string, parameter) =>{
    if (!string) throw new Error(`You must provide a ${parameter}`);
    if (typeof string !== 'string') throw new Error(`${parameter} must be a string`);
    string = string.trim()
    if (string.length === 0)
      throw new Error(`${parameter} cannot be an empty string or just spaces`);
    return string;
}

export const isValidEmail = (email) => {
    email = isValidString(email, "Email");
    if(!email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ))
      throw new Error('Invalid Email');
    return email.toLowerCase();
}

export const isPasswordSame = (repassword, password) => {
  repassword = isValidPassword(repassword);
  if(repassword === password) return repassword
  throw new Error('Passwords dont match')
}

export const isValidPassword = (passowrd) => {
    if(!passowrd.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/))
        throw new Error('Invalid password');
    return passowrd
}

export const isValidAddress = (address) =>{
    address = isValidString(address, "Address");
    if(!address.match(/^[a-zA-Z0-9 \s,.'-]{3,}$/))
        throw new Error('Invalid Address');
    return address;
}

export const isValidZip = (zip) => {
    if(!zip.match(/(^\d{5}$)|(^\d{5}-\d{4}$)/)) throw new Error('Invalid zip');
    return zip;
}

export const isValidName = (inputName) => {
  inputName = isValidString(inputName,"Name");
  let name=inputName.split(' '); 
  if(name.length!==2) throw new Error('Invalid name'); 
  if(name[0].length<3)
    throw new Error('First name should be atleast 3 character');
  if(name[1].length<3)
    throw new Error('Last name should be atleast 3 character');
  if(name[0].match(/^[^a-zA-Z0-9]+$/) || (name[0].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[0].length && name[0].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[0].length-1))
    throw new Error( 'Invalid first name');
  if(name[1].match(/^[^a-zA-Z0-9]+$/) || (name[1].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[1].length && name[1].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[1].length-1))
    throw new Error( 'Invalid last name');
  if(!name[0].match(/^[a-z.'-]+$/i))
    throw new Error('Invalid first name');
  if(!name[1].match(/^[a-z.'-]+$/i))
    throw new Error('Invalid last name');
  return inputName;
}

export const isValidAppointmentDuration = (appointmentDuration) =>{
    appointmentDuration = parseInt(appointmentDuration);
    if(appointmentDuration%15!==0 || appointmentDuration>90)
        throw new Error('Invalid Appointment Duration');
    return appointmentDuration;
}

export const isValidSchedule = (schedule) =>{
    const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    for(let day in schedule)
    {
        for(let i=0;i<weekDays.length;i++){
            if(weekDays[i].toLowerCase() === day.toLowerCase())
                break;
            else if(weekDays.length-1 === i)
                throw new Error('Invalid day in schedule');
        }
        if(!Array.isArray(schedule[day]))
            throw new Error(`Invalid data type in slot for ${day}`);
        for(let i=0;i<schedule[day].length;i++)
        {            
            if(schedule[day][i].length!==2)
                throw new Error(`Invalid slot for ${day}`);

            schedule[day][i][0] = isValidString(schedule[day][i][0]);
            schedule[day][i][1] = isValidString(schedule[day][i][1]);

            const startTime = schedule[day][i][0].split(':');
            const endTime = schedule[day][i][1].split(':');

            if(startTime.length !==2 || endTime.length !== 2)
                throw new Error(`Invalid slot for ${day}`);

            if(startTime[0].length !==2 || !startTime[0].match(/^[0-9]+$/i) || parseInt(startTime[0])>23 || startTime[1].length !==2 || !startTime[1].match(/^[0-9]+$/i) || parseInt(startTime[1])>59)
                throw new Error(`Invalid slot for ${day}`);
            if(endTime[0].length !==2 || !endTime[0].match(/^[0-9]+$/i) || parseInt(endTime[0])>23 || endTime[1].length !==2 || !endTime[1].match(/^[0-9]+$/i) || parseInt(endTime[1])>59 || parseInt(startTime[0])>parseInt(endTime[0]) || (parseInt(startTime[0])===parseInt(endTime[0]) && parseInt(startTime[1])>parseInt(endTime[1])))
                throw new Error(`Invalid slot for ${day}`);
        }    
    }
    return schedule;
}

export const isValidSpeciality = (speciality) =>{
  speciality = isValidString(speciality, "Speciality");

  for(let i=0;i<specialities.length;i++)
      if(speciality.toLowerCase() === specialities[i].toLowerCase())
          return specialities[i];
  throw new Error( "Invalid Speciality");
}

export const isValidLink = (link) => {
  if (link.length < 1) throw new Error("No link found.")
  const url = new URL(link);
  if (!Boolean(url)) throw new Error("Not a valid url")
  if(!link.match(/https:\/\/[\w-]*\.?zoom.us\/(j|my)\/[\d\w?=-]+/g)) throw new Error("Not the correct url");
  return link;
}
export const isValidNpi = (npi) => {
  npi = isValidString(npi, "NPI");
  if(!npi.match(/^[A-Z]{3}[0-9]{7}$/))
      throw new Error( 'Invalid NPI');
  return npi;
}
export const isValidNumber = (num,param) => {
  num = num.toString();
  num = isValidString(num);
  
  if(!num.match(/^\d+$/)) throw new Error(`Invalid ${param}`);
  return parseInt(num);
}
export const isValidPrescription = (prescriptions) => {
  for(let pres of prescriptions)
  {

    pres['disease']=isValidString(pres['disease'],'disease');
    pres['doctorSuggestion']=isValidString(pres['doctorSuggestion'],'doctorSuggestion');
    //pres['document']=isValidString(pres['document'])
    pres['medicine']=isValidString(pres['medicine'],'medicine')
    pres['strength']=isValidNumber(pres['strength'],'strength')
    pres['dosage']=isValidNumber(pres['dosage'],'dosage')
    // for(let p in pres['medicine']){
    //   if(!Array.isArray( pres['medicine'][p])) throw new Error('medicine is not an object');
    //   pres['medicine'][p]=isValidString(pres['medicine'][p][0]);
    //   pres['medicine'][p]=isValidString(pres['medicine'][p][1]);
    // }
  }
  return prescriptions;
}