const common = require("./common");

const isValidAddress = (address) => {
  address = common.isValidString(address, "Address");
  if (!address.match(/^[a-zA-Z0-9 \s,.'-]{3,}$/))
    throw { status: "400", error: "Invalid Address" };
  return address;
};

const isValidStartTime = (startTime) => {
  if (!startTime) throw { status: "400", error: "No time provided" };
  const t =new Date(startTime);
  if (t === "Invalid Date")
    throw { status: "400", error: "Invalid startTime" };
  return startTime;
};

const validateData = (data) => {
  if (!data) throw { status: "400", error: "New data not provided" };
  for (key in data) {
    switch (key) {
      case "_id": 
        data._id = common.isValidId(data._id)
        break
      case "startTime":
        data.startTime = isValidStartTime(data.startTime);
        break;
      case "appointmentLocation":
        data.appointmentLocation = isValidAddress(data.appointmentLocation);
        break;
      case "doctorId":
        data.doctorId = common.isValidId(data.doctorId)
        break
      case "patientId":
        data.patientId = common.isValidId(data.patientId)
        break
      default:
        throw { status: "400", error: `Invalid key - ${key}` };
    }
  }
  return data;
};

module.exports = {
  isValidAddress,
  isValidStartTime,
  validateData,
};
