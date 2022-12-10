const {transporter} = require("../config/nodeMailerTransporter");

const sendEmail = async(to, subject, html) => {
    await transporter.sendMail({
        from: '<doctolib.app@gmail.com>',
        to,
        subject,
        html
      }); 
}

const sendAppointmentConfirmation = async(data) =>{
  const html = `<h1> Appointment Confirmation </h1> <br/> <span> Time : </span> <span> ${data.appointment.startTime} </span> <br/> <span> Address : </span> <span> ${data.doctor.clinicAddress} </span>`;
  await sendEmail(data.doctor.email, "Appointment Confirmation", html);
  await sendEmail(data.patient.email, "Appointment Confirmation", html);
}

const sendAppointmentUpdate = async(data) =>{
  const html = `<h1> Appointment Confirmation </h1> <br/> <span> Time : </span> <span> ${data.appointment.startTime} </span> <br/> <span> Address : </span> <span> ${data.doctor.clinicAddress} </span>`;
  await sendEmail(data.doctor.email, "Appointment Update", html);
  await sendEmail(data.patient.email, "Appointment Update", html);
}

const sendAppointmentReminder = async(data) =>{
  const html = `<h1> Appointment Confirmation </h1> <br/> <span> Time : </span> <span> ${data.startTime} </span> <br/> <span> Address : </span> <span> ${data.appointmentLocation} </span>`;
  await sendEmail(data.doctorEmail, "Appointment Reminder", html);
  await sendEmail(data.patientEmail, "Appointment Reminder", html);
}

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentUpdate,
  sendAppointmentReminder
}