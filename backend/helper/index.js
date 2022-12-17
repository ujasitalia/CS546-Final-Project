const commonHelpers = require('./common');
const doctorHelpers = require('./doctor');
const patientHelpers = require('./patient');
const reviewHelpers = require('./review');
const appointmentHelpers = require('./appointment');
const chatHelpers = require('./chat');

module.exports = {
common : commonHelpers,
doctor : doctorHelpers,
patient : patientHelpers, 
review : reviewHelpers,
appointment : appointmentHelpers,
chat : chatHelpers
}