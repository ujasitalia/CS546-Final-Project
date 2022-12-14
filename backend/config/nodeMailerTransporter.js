const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "doctolib.app@gmail.com",
        pass: "kjtibhebghnriitd",
    }
  });

  module.exports = {
    transporter
  }