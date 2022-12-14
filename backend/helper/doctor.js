const constants = require("../constants");
const common = require("./common");

const isValidSpeciality = (speciality) =>{
    speciality = common.isValidString(speciality, "speciality");

    for(let i=0;i<constants.speciality.length;i++)
        if(speciality.toLowerCase() === constants.speciality[i].toLowerCase())
            return constants.speciality[i];
    throw {status: '400', error : "Invalid speciality"};
}

const isValidAddress = (address) =>{
    address = common.isValidString(address, "Address");
    if(!address.match(/^[a-zA-Z0-9 \s,.'-]{3,}$/))
        throw {status: '400', error : 'Invalid Address'}
    return address;
}

const isValidAppointmentDuration = (appointmentDuration) =>{
    if(isNaN(appointmentDuration) || typeof appointmentDuration != 'number'){
        throw {status: '400', error : 'Not a number'}
    }
    if(appointmentDuration%15!=0 || appointmentDuration>90)
        throw {status: '400', error : 'Invalid Appointment Duration'}
    return appointmentDuration;
}

const isValidSchedule = (schedule) =>{
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    if(typeof schedule !== "object" || Array.isArray(schedule))
        throw {status: '400', error : `Invalid data type for schedule`};

    for(let day in schedule)
    {
        for(let i=0;i<weekDays.length;i++){
            if(weekDays[i].toLowerCase() === day.toLowerCase())
                break;
            else if(weekDays.length-1 == i)
                throw {status: '400', error : 'Invalid day in schedule'};
        }
        if(!Array.isArray(schedule[day]))
            throw {status: '400', error : `Invalid data type in slot for ${day}`};
        for(let i=0;i<schedule[day].length;i++)
        {            
            if(schedule[day][i].length!==2)
                throw {status: '400', error : `Invalid slot for ${day}`};

            schedule[day][i][0] = common.isValidString(schedule[day][i][0]);
            schedule[day][i][1] = common.isValidString(schedule[day][i][1]);
            const startTime = schedule[day][i][0].split(':');
            const endTime = schedule[day][i][1].split(':');

            if(startTime.length !==2 || endTime.length !== 2)
                throw {status: '400', error : `Invalid slot for ${day}`};

            if(startTime[0].length !==2 || !startTime[0].match(/^[0-9]+$/i) || parseInt(startTime[0])>23 || startTime[1].length !==2 || !startTime[1].match(/^[0-9]+$/i) || parseInt(startTime[1])>59 || (parseInt(startTime[1])%15)!=0)
                throw {status: '400', error : `Invalid slot for ${day}`};
            if(endTime[0].length !==2 || !endTime[0].match(/^[0-9]+$/i) || parseInt(endTime[0])>23 || endTime[1].length !==2 || !endTime[1].match(/^[0-9]+$/i) || parseInt(endTime[1])>59 || (parseInt(endTime[1])%15)!=0 ||parseInt(startTime[0])>parseInt(endTime[0]) || (parseInt(startTime[0])==parseInt(endTime[0]) && parseInt(startTime[1])>parseInt(endTime[1])))
                throw {status: '400', error : `Invalid slot for ${day}`};
        }    
        
    }
    return schedule;
}

const isValidDoctorData = (data) =>{
    for(key in data)
    {
        switch(key){
            case "email":
                data.email = common.isValidEmail(data.email);
                break;
            case "profilePicture":
                data.profilePicture = common.isValidFilePath(data.profilePicture);
                break;
            case "name":
                data.name = common.isValidName(data.name);
                break;
            case "speciality":
                data.speciality = isValidSpeciality(data.speciality);
                break;
            case "clinicAddress":
                data.clinicAddress = isValidAddress(data.clinicAddress);
                break;
            case "zip":
                data.zip = common.isValidZip(data.zip);
                break;
            case "password":
                data.password = common.isValidPassword(data.password);
                break;
            case "schedule":
                data.schedule = isValidSchedule(data.schedule);
                break;
            case "appointmentDuration":
                data.appointmentDuration = isValidAppointmentDuration(data.appointmentDuration);
                break;
            case "rating":
                break;
            default:
                throw {status: '400', error : `Invalid key - ${key}`};
            
        }
    }
    return data;
}

const isValidNpi = (npi) => {
    npi = common.isValidString(npi, "NPI");
    if(!npi.match(/^[A-Z]{3}[0-9]{7}$/))
        throw {status: '400', error : 'Invalid NPI'}
    return npi;
    }
const isValidMedicine = (medicine) => {
    let newMedicine = {}
    for(let m in medicine){
        let key=common.isValidString(m,'Medicine');
        if(!Array.isArray(medicine[m])) throw {status:'400',error:'Medicine must be an array'};
        common.isValidString(medicine[m][0],'Dosage') 
        if( typeof medicine[m][1] !== 'number') throw {status:'400',error:'Medicine frquency must be a number'};
        newMedicine[key]=medicine[m];
    }
    return newMedicine;
}

module.exports = {
    isValidSpeciality,
    isValidAddress,
    isValidSchedule,
    isValidDoctorData,
    isValidNpi,
    isValidMedicine
};