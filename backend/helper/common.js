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
    return email;
}

const isValidFilePath = (filePath) => {
    filePath = isValidString(filePath, "File path");
    return filePath
}

const isValidPassword = (passowrd) => {
    if(!passowrd.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/))
        throw {status: '400', error : 'Invalid Password'}
    return passowrd
}

module.exports = {
    isValidId,
    isValidString,
    isValidEmail,
    isValidFilePath,
    isValidPassword
};