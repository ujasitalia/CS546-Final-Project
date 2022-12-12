const express = require('express');
const app = express();
const cors = require('cors');
const configRoutes = require('./routes');
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const data = require('./data');

app.use(express.json());
app.use(cors());

app.use('/', (req, res, next) => {
  if(!((req.originalUrl === '/doctor/login' || req.originalUrl === '/patient/login') || (req.originalUrl === '/doctor' && req.method === 'POST') || (req.originalUrl === '/patient' && req.method === 'POST')))
  {
    try{
      let token  = req.headers.authorization;
      token = token.split(" ")[1];
      if (!token) {
        res.status(403).json('Forbidden');
        return;
      } else {
        const decoded = jwt.verify(token, "pd");
        req.user = decoded;
        next();
        return;
      }
    }catch(e){
      res.status(403).json('Forbidden')
      return;
    }
  }
  next();
});

app.use('/appointment',
async(req, res, next) => {
  if(req.url === '/')
    if(req.body.patientId !== req.user.userId)
    {
      res.status(403).json('Forbidden')
      return;
    }else{
      next();
      return;
    }
    
  try{
      await data.appointment.checkAppointmentExist(req.user.role, req.user.userId,req.url.split('/')[1]);
  }catch(e){
    res.status(403).json('Forbidden')
    return;
  }
  next();
});

app.use('/chat', (req, res, next) => {
  if(req.url === '/')
    if(req.body.senderId !== req.user.userId)
    {
      res.status(403).json('Forbidden')
      return;
    }else{
      next();
      return;
    }
  if(req.url.split('/')[1] !== req.user.userId)
  { 
    res.status(403).json('Forbidden')
    return;
  }
  next();
});

app.use('/patient/:patientId', (req, res, next) => {
  if(req.params.patientId !== 'login' && req.params.patientId !== req.user.userId)
  { 
    res.status(403).json('Forbidden')
    return;
  }
  next();
});

app.use('/doctor', (req, res, next) => {
  if(req.url === '/' && req.method === 'GET' && req.user.role !== 'patient')
  { 
    res.status(403).json('Forbidden')
    return;
  }
  next();
});

app.use('/doctor/:doctorId', (req, res, next) => {
  if(req.url === '/' && req.method==='GET' && req.user.role !== 'patient' && req.params.doctorId !== req.user.userId)
  { 
    res.status(403).json('Forbidden')
    return;
  }else if(req.url === '/' && req.method==='PATCH' && req.params.doctorId !== req.user.userId)
  {
    res.status(403).json('Forbidden')
    return;
  }
  next();
});

app.use('/doctor/:doctorId/appointment', (req, res, next) => {
  if(req.params.doctorId !== req.user.userId)
  {
    res.status(403).json('Forbidden')
    return;
  }
  next();
});

app.use('/doctor/:doctorId/review', (req, res, next) => {
  if(req.user.role !== 'patient' && req.params.doctorId !== req.user.userId)
  {
    res.status(403).json('Forbidden')
    return;
  }
  next();
});

app.use('/doctor/:doctorId/patient/:patientId', async(req, res, next) => {
  try{
    const doctor = await data.doctor.isDoctorsPatient(req.params.doctorId, req.params.patientId)
    if(req.params.doctorId !== req.user.userId && !doctor)
    {
      res.status(403).json('Forbidden')
      return;
    }
  }catch(e){
    res.status(403).json('Forbidden')
    return;
  }
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

cron.schedule("*/60 * * * * *", function() {
  data.appointment.sendAppointmentReminder();
  data.appointment.changeAppointmentCompleteStatus();
});
