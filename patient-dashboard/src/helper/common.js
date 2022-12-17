import { type } from "@testing-library/user-event/dist/type";

export const isValidString = (string, parameter) => {
  if (!string)
    throw new Error(`You must provide a ${parameter}`);
  if (typeof string !== "string")
    throw new Error(`${parameter} must be a string`);
  string = string.trim();
  if (string.length === 0)
    throw new Error(`${parameter} cannot be an empty string or just spaces`);
  return string;
};
const isValidPastDate = (time) => {
  if (!time) throw { status: "400", error: "No date provided" };
  time = new Date(time);
  let today = new Date();
  if (time === "Invalid Date" || time > today)
    throw { status: "400", error: "Invalid date" };
};
export const isValidMedicalHistory = (medicalHistory) => {
  for(let i=0;i<medicalHistory.length;i++){
    
    medicalHistory[i]['disease']= isValidString(medicalHistory[i]['disease'],'disease');

    //isValidId(mh.medicalHistoryId);
    isValidPastDate(medicalHistory[i]['startDate']);
    if(medicalHistory[i]['endDate'])
    isValidPastDate(medicalHistory[i]['endDate']);
  }
  return medicalHistory;
}

export const isValidTestReports = (TestReport) => {
  for(let i=0;i<TestReport.length;i++)
  {
    //isValidId(test.testReportId);
    TestReport[i]['testName']= isValidString(TestReport[i]['testName'],'Test Name');
    TestReport[i]['testDocument'] = isValidString(TestReport[i]['testDocument'], 'testDocument');
  }
  return TestReport;
}

export const isValidEmail = (email) => {
  email = isValidString(email, "Email");
  if (
    !email.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  )
    throw new Error("Invalid Email");
  return email.toLowerCase();
};

export const isPasswordSame = (repassword, password) => {
  repassword = isValidPassword(repassword);
  if(repassword===password) return repassword
  throw new Error('Passwords dont match')
}

export const isValidPassword = (passowrd) => {
  if (
    !passowrd.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/)
  )
    throw new Error("Invalid Password");
  return passowrd;
};

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

export const isValidAge = (age) => {
  age=age.toString();
  if(!age.match(/^\d+$/) || !age || age<1 || age>120 || age%1) throw new Error('Invalid age');
  return parseInt(age);
}

export const isValidRating = (rating) => {
  rating = parseFloat(rating);
  if(rating<0 || rating>5){
      throw new Error('rating must between 1 to 5');
  }
  if((rating*10)%1 !== 0){
      throw new Error('invalid input');
  }
  return rating;
};
export const isValidReviewText = (reviewText) => {
  reviewText = reviewText.trim();
  if(reviewText.length <4){
    throw new Error('Review under character limit');
  }
  if(reviewText.length > 500){
      throw new Error('Review over character limit');
  }
  return reviewText;
};