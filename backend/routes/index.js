const doctorRoutes = require('./doctor');
const patientRoutes = require('./patient');
const reviewRoutes = require('./review');
const appointmentRoutes = require('./appointment');
const chatRoutes = require('./chat');
const healthyHabitRoutes = require('./healthyHabit');

const constructorMethod = (app) => {
  app.use('/doctor', doctorRoutes);
  app.use('/patient', patientRoutes);
  app.use('/review', reviewRoutes);
  app.use('/appointment', appointmentRoutes);
  app.use('/chat', chatRoutes);
  app.use('/healthyHabit', healthyHabitRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;