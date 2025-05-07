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

async function getOnlineUsers(io) {
  const users = []

  const sockets = await io.fetchSockets()
  for (const socket of sockets) {
    if (socket.handshake.auth?.username) {
      users.push({
        socketId: socket.id,
        username: socket.handshake.auth?.username
      })
    }
  }

  return users
}

io.on('connection', (socket) => {
  console.log("New client connected:", socket.id);
  
  socket.on('addClient', async function(username) {
    socket.username = username;
    usernames[username] = username;
    scores[socket.username] = 0;
    socket.emit('updatechat', 'SERVER', 'You are connected!', socket.id);
    const users = await getOnlineUsers(io)
    io.emit('users/info', users);
  });
  
  socket.on('result', function(data) {
    io.emit('viewresult', data);
  });
  
  socket.on('disconnect', function() {
    console.log("Client disconnected:", socket.username || socket.id);
    if (socket.username) {
      delete usernames[socket.username];
      io.emit('updateusers', usernames);
    }
  });
});

module.exports = { app, server };
