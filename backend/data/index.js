const doctorData = require('./doctor');
const patientData = require('./patient');
const reviewData = require('./review');
const appointmentData = require('./appointment');
const chatData = require('./chat');

module.exports = {
doctor : doctorData,
patient : patientData, 
review : reviewData,
appointment : appointmentData,
chat : chatData
}