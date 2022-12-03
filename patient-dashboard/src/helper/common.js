export const isValidString = (string, parameter) => {
  if (!string)
    throw new Error(`You must provide an ${parameter} to search for`);
  if (typeof string !== "string")
    throw new Error(`${parameter} must be a string`);
  string = string.trim();
  if (string.length === 0)
    throw new Error(`${parameter} cannot be an empty string or just spaces`);
  return string;
};

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

export const isValidPassword = (passowrd) => {
  if (
    !passowrd.match(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,12}$/)
  )
    throw new Error("Invalid Password");
  return passowrd;
};

export const validateSearchData = (data) => {
  if (!data.trim()) throw new Error("Enter doctor name");
  data = data.trim();
  const reg = new RegExp(/[~`!@#$%^&*()_+\-=\[\]{};:'"\\|,.<>\/?0-9]/g);
  if (reg.test(data) || data.search(/\s\s/) > 0)
    throw new Error("Invalid doctor name");
  return data;
};
