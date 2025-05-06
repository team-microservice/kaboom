if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", require("./routers"));

const usernames = {};
const rooms = {};
const scores = {};

io.on('connection', (socket) => {
  console.log("New client connected:", socket.id);
  
  socket.on('addClient', function(username) {
    socket.username = username;
    usernames[username] = username;
    scores[socket.username] = 0;
    socket.emit('updatechat', 'SERVER', 'You are connected!', socket.id);
  });
  
  socket.on('result', function(data, roomId) {
    io.to(roomId).emit('viewresult', data);
  });
  
  socket.on('disconnect', function() {
    console.log("Client disconnected:", socket.username || socket.id);
    if (socket.username) {
      delete usernames[socket.username];
      io.emit('updateusers', usernames);
    }
    
    if (socket.roomId) {
      socket.leave(socket.roomId);
    }
  });
});

module.exports = { app, server };
