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
  const html = `<h1> Appointment Confirmation </h1> <br/> <span> Doctor Name : </span> <span> ${data.doctorName} </span> <br/> <span> Patient Name : </span> <span> ${data.patientName} </span> <br/> <span> Date : </span> <span> ${data.startTime.split('T')[0]} </span> <br/> <span> ${data.startTime.split('T')[1]} </span> <br/> <span> Address : </span> <span> ${data.appointmentLocation} </span>`;
  await sendEmail(data.doctorEmail, "Appointment Confirmation", html);
  await sendEmail(data.patientEmail, "Appointment Confirmation", html);
}

const sendAppointmentUpdate = async(data) =>{
  const html = `<h1> Appointment Update </h1> <br/> <span> Doctor Name : </span> <span> ${data.doctorName} </span> <br/> <span> Patient Name : </span> <span> ${data.patientName} </span> <br/> <span> Date : </span> <span> ${data.startTime.split('T')[0]} </span> <br/> <span> ${data.startTime.split('T')[1]} </span> <br/> <span> Address : </span> <span> ${data.appointmentLocation} </span>`
  await sendEmail(data.doctorEmail, "Appointment Update", html);
  await sendEmail(data.patientEmail, "Appointment Update", html);
}

const sendAppointmentCancel = async(data) =>{
  const html = `<h1> Appointment Cancel </h1> <br/> <span> Doctor Name : </span> <span> ${data.doctorName} </span> <br/> <span> Patient Name : </span> <span> ${data.patientName} </span> <br/> <span> Date : </span> <span> ${data.startTime.split('T')[0]} </span> <br/> <span> ${data.startTime.split('T')[1]} </span> <br/> <span> Address : </span> <span> ${data.appointmentLocation} </span>`;
  await sendEmail(data.doctorEmail, "Appointment cancel", html);
  await sendEmail(data.patientEmail, "Appointment cancel", html);
}

const sendAppointmentReminder = async(data) =>{
  const html = `<h1> Appointment Reminder </h1> <br/> <span> Doctor Name : </span> <span> ${data.doctorName} </span> <br/> <span> Patient Name : </span> <span> ${data.patientName} </span> <br/> <span> Date : </span> <span> ${data.startTime.split('T')[0]} </span> <br/> <span> ${data.startTime.split('T')[1]} </span> <br/> <span> Address : </span> <span> ${data.appointmentLocation} </span>`;
  await sendEmail(data.doctorEmail, "Appointment Reminder", html);
  await sendEmail(data.patientEmail, "Appointment Reminder", html);
}

module.exports = {
  sendAppointmentConfirmation,
  sendAppointmentUpdate,
  sendAppointmentReminder,
  sendAppointmentCancel
}