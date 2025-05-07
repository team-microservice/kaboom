if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 3000;
const cors = require("cors");
const express = require("express");
const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", require("./routers"));

const scores = {};

async function getOnlineUsers(io) {
  const users = [];

  const sockets = await io.fetchSockets();
  for (const socket of sockets) {
    if (socket.handshake.auth?.username) {
      users.push({
        socketId: socket.id,
        username: socket.handshake.auth?.username,
      });
    }
  }

  return users;
}

let playerCount = 0;
let playerConnected = 0;

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("addClient", async function (users) {
    const {username, id} = users;
    users[username] = username;
    users[id] = id;

    scores[socket.username] = 0;

    if (playerCount === 1 || playerCount >= 3) {
      id = Math.round(Math.random() * 1000000);
      socket.room = id;
      playerCount = 1;

      console.log(playerCount + " " + id);

      socket.join(id);
      playerConnected = 1;
    } else if (playerCount === 2) {
      console.log(playerCount + " " + id);

      socket.join(id);
      playerConnected = 2;
    }

		console.log(username + " joined to "+ id);

    socket.emit("updatechat", "You are connected!", id);

		io.emit('updatechat', username + ' has joined to this game !', id);

    const user = await getOnlineUsers(io);
    io.emit("users/info", user);
  });

  socket.on("result", function (data) {
    io.emit("viewresult", data);
  });

  socket.on("disconnect", function () {
    console.log("Client disconnected:", socket.username || socket.id);
    if (socket.username) {
      delete usernames[socket.username];
      io.emit("updateusers", usernames);
      const user = getOnlineUsers(io);
      io.emit("users/info", user);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
