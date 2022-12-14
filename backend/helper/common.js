const {ObjectId} = require('mongodb');


const isValidString = (string, parameter) =>{
    if (!string) throw {status: '400', error : `You must provide an ${parameter} to search for`};
    if (typeof string !== 'string') throw {status: '400', error : `${parameter} must be a string`};
    string = string.trim()
    if (string.length === 0)
      throw {status: '400', error : `${parameter} cannot be an empty string or just spaces`};
    return string;
}

const isValidId = (id) => {
    id = isValidString(id, "ID");
    if (!ObjectId.isValid(id)) throw {status: '400', error : 'Invalid object ID'};
    return id;
}

const isValidEmail = (email) => {
    email = isValidString(email, "Email");
    if(!email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ))
      throw {status: '400', error : 'Invalid Email'}
    return email.toLowerCase();
}

const isValidFilePath = (filePath) => {
  const meta = filePath.split(",")[0].split(";");
    if(meta[1] !== 'base64')
      throw {status: '400', error : 'Invalid file'}
    return filePath;
}

const isValidPassword = (passowrd) => {
    if(!passowrd.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/))
        throw {status: '400', error : 'Invalid Password'}
    return passowrd
}

const isValidZip = (zip) => {
    
    if(!zip.match(/(^\d{5}$)|(^\d{5}-\d{4}$)/)) throw {status:"400", error:'Invalid zip'};
    return zip;
}

const isValidName = (inputName) => {
  inputName = isValidString(inputName,"Name");
  let name=inputName.split(' '); 
  if(name.length!=2) throw {status:400, error:'Invalid name'}; 
  if(name[0].length<3)
    throw {status: '400', error : 'First name should be atleast 3 character'};
  if(name[1].length<3)
    throw {status: '400', error : 'Last name should be atleast 3 character'};
  if(name[0].match(/^[^a-zA-Z0-9]+$/) || (name[0].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[0].length && name[0].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[0].length-1))
    throw {status: '400', error : 'Invalid first name'};
  if(name[1].match(/^[^a-zA-Z0-9]+$/) || (name[1].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[1].length && name[1].replace(/[^a-zA-Z0-9 ]/g, '').length !== name[1].length-1))
    throw {status: '400', error : 'Invalid last name'};
  if(!name[0].match(/^[a-z.'-]+$/i))
    throw {status: '400', error : 'Invalid first name'};
  if(!name[1].match(/^[a-z.'-]+$/i))
    throw {status: '400', error : 'Invalid last name'};
    return inputName;
}

const isValidCity = (city) => {
    city = isValidString(city,"City");
    return city;
}
const isValidState = (state) => {
    return isValidString(state,"State");
} 

const isValidTime = (time) => {
  if (!time) throw { status: "400", error: "No time provided" };
  time = new Date(time);
  if (time === "Invalid Date")
    throw { status: "400", error: "Invalid startTime" };
  return time;
};

const isValidDuration = (n) => {
  if (!n) throw { status: "400", error: "No duration provided" };
  if(typeof n !== 'number') throw {status: "400", error: "duration invalid"};
  return n;
}

const isBoolean = (val) => {
  // if (!val) throw {status: "400", error: "No value provided"};
  if(typeof val !== "boolean") throw {status: "400", error: "value invalid"};
  return val
}

const isValidLink = (link) => {
  if (link.length < 1) throw {status: "400", error: "No link found."}
  const url = new URL(link);
  if (!Boolean(url)) throw {status: "400", error: "Not a valid url"}
  if(!url.host == 'stevens.zoom.us') throw {status: "400", error: "Not the correct url"}
  return link;
}
const isValidPastDate = (time) => {
  if (!time) throw { status: "400", error: "No time provided" };
  time = new Date(time);
  today = new Date();
  if (time === "Invalid Date" || time > today)
    throw { status: "400", error: "Invalid date" };
  return time;
};

module.exports = {
    isValidId,
    isValidString,
    isValidEmail,
    isValidFilePath,
    isValidPassword,
    isValidCity,
    isValidState,
    isValidZip,
    isValidName,
    isValidTime,
    isValidDuration,
    isBoolean,
    isValidLink,
    isValidPastDate
};