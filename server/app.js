if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const PORT = process.env.PORT || 3000;
const { default: axios } = require("axios");
const { log } = require("console");
const cors = require("cors");
const express = require("express");
const app = express();

const { createServer } = require("http");
const { Server } = require("socket.io");

const fs = require('fs');
const path = require('path');

// Buat path untuk menyimpan leaderboard
const leaderboardPath = path.join(__dirname, '/data/leaderboard.json');

// Fungsi untuk memuat leaderboard dari file
function loadLeaderboard() {
  try {
    if (fs.existsSync(leaderboardPath)) {
      const data = fs.readFileSync(leaderboardPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading leaderboard:', err);
  }
  return [];
}

// Fungsi untuk menyimpan leaderboard ke file
function saveLeaderboard(data) {
  try {
    fs.writeFileSync(leaderboardPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error saving leaderboard:', err);
  }
}

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

// Muat leaderboard dari file saat server dimulai
let leaderboardData = loadLeaderboard();

function updateLeaderboard(username, score) {
  // Check if user already exists in leaderboard
  const existingPlayerIndex = leaderboardData.findIndex(player => player.username === username);
  
  if (existingPlayerIndex !== -1) {
    // Update score if it's higher than existing score
    if (score > leaderboardData[existingPlayerIndex].score) {
      leaderboardData[existingPlayerIndex].score = score;
    }
  } else {
    // Add new player
    leaderboardData.push({ username, score });
  }
  
  // Sort leaderboard by score in descending order
  leaderboardData.sort((a, b) => b.score - a.score);
  
  // Keep only top 5 players
  leaderboardData = leaderboardData.slice(0, 5);
  
  // Simpan ke file setiap kali ada perubahan
  saveLeaderboard(leaderboardData);
  
  return leaderboardData;
}

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

  // Kirim data leaderboard terbaru ke client yang baru terhubung
  socket.emit("leaderboard/update", leaderboardData);

  socket.on("addClient", async function (users) {
    let { username, id } = users;
    socket.username = username;
    users[username] = username;
    users[id] = id;

    scores[socket.username] = 0;

    playerCount++;
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

    console.log(username + " joined to " + id);

    socket.emit("updatechat", "You are connected!", id);

    io.emit("updatechat", username + " has joined to this game !", id);

    const user = await getOnlineUsers(io);
    io.emit("users/info", user);

    const result = await axios.get(
      "https://gp.dhronz.space/gemini/generate-quiz"
    );
    const questions = result.data;

    if (playerConnected == 2) {
      io.emit("sendquestions", questions);
      console.log("Player 2");
    } else {
      console.log("Player 1");
    }
  });

  socket.on("result", function (data) {
    io.emit("viewresult", {
      score: data,
      username: socket.handshake.auth.username || socket.username
    });

    const usernameToUse = socket.handshake.auth.username || socket.username;
    
    if (usernameToUse && data) {
      const updatedLeaderboard = updateLeaderboard(usernameToUse, parseInt(data) || 0);
      io.emit("leaderboard/update", updatedLeaderboard);
    }
  });

  socket.on("disconnect", function () {
    console.log("Client disconnected:", socket.username || socket.id);
    if (socket.username) {
      // Saat client disconnect, simpan leaderboard
      saveLeaderboard(leaderboardData);
      
      getOnlineUsers(io).then(users => {
        io.emit("users/info", users);
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
