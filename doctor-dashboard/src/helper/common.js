export const isValidString = (string, parameter) =>{
    if (!string) throw new Error(`You must provide an ${parameter} to search for`);
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

export const isValidPassword = (passowrd) => {
    if(!passowrd.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/))
        throw new Error('Invalid Password');
    return passowrd
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