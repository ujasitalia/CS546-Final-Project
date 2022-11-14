const constants = require("../constants");
const { isValidString } = require("./common");

const isValidSpecialty = (specialty) =>{
    specialty = isValidString(specialty, "Specialty");
    for(let i=0;i<constants.specialty.length;i++)
        if(specialty.toLowerCase() === constants.specialty[i].toLowerCase())
            return constants.specialty[i];
    throw {status: '400', error : "Invalid Specialty"};
}

const isValidAddress = (address) =>{
    address = isValidString(address, "Address");
    if(!address.match(/^[a-zA-Z0-9 \s,.'-]{3,}$/))
        throw {status: '400', error : 'Invalid Address'}
    return address;
}

const isValidSchedule = (schedule) =>{
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for(day in schedule)
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

            const startTime = schedule[day][i][0].split(':');
            const endTime = schedule[day][i][1].split(':');

            if(startTime.length !==2 || endTime.length !== 2)
                throw {status: '400', error : `Invalid slot for ${day}`};

            if(startTime[0].length !==2 || !startTime[0].match(/^[0-9]+$/i) || parseInt(startTime[0])>23 || startTime[1].length !==2 || !startTime[1].match(/^[0-9]+$/i) || parseInt(startTime[1])>59)
                throw {status: '400', error : `Invalid slot for ${day}`};
            if(endTime[0].length !==2 || !endTime[0].match(/^[0-9]+$/i) || parseInt(endTime[0])>23 || endTime[1].length !==2 || !endTime[1].match(/^[0-9]+$/i) || parseInt(endTime[1])>59 || parseInt(startTime[0])>parseInt(endTime[0]) || (parseInt(startTime[0])==parseInt(endTime[0]) && parseInt(startTime[1])>parseInt(endTime[1])))
                throw {status: '400', error : `Invalid slot for ${day}`};
        }    
        
    }
    return schedule;
}

module.exports = {
    isValidSpecialty,
    isValidAddress,
    isValidSchedule
};