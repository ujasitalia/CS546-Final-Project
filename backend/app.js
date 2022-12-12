const express = require('express');
const app = express();
const cors = require('cors');
const configRoutes = require('./routes');
const jwt = require("jsonwebtoken");
const cron = require("node-cron");

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


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});

cron.schedule("*/60 * * * * *", function() {
  const data = require("./data");
  data.appointment.sendAppointmentReminder();
  data.appointment.changeAppointmentCompleteStatus();
});
