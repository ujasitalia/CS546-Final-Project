const common = require("./common");

const isValidAddress = (address) => {
  address = common.isValidString(address, "Address");
  if (!address.match(/^[a-zA-Z0-9 \s,.'-]{3,}$/))
    throw { status: "400", error: "Invalid Address" };
  return address;
};

const isValidStartTime = (startTime) => {
  if (!startTime) throw { status: "400", error: "No time provided" };
  if (new Date(startTime) === "Invalid Date")
    throw { status: "400", error: "Invalid startTime" };
  return startTime;
};

module.exports = {
  isValidAddress,
  isValidStartTime,
};
