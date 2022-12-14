const express = require('express');
const app = express();
const cors = require('cors');
const configRoutes = require('./routes');
const jwt = require("jsonwebtoken");
const {Server} = require("socket.io");
const http = require("http");
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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origins: ["http://localhost:3006", "http://localhost:3003"],
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  socket.on("newMessage", (data) => {
    socket.broadcast.emit("recievedMessage", data);
  });
});

server.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
