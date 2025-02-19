const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

const gameLobbies = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join-lobby", (gameCode, username) => {
    if (!gameLobbies[gameCode]) {
      gameLobbies[gameCode] = [];
    }
   
    if (!gameLobbies[gameCode].includes(username)) {
      gameLobbies[gameCode].push(username);
      socket.join(gameCode);
      console.log(`${username} joined lobby ${gameCode}`);
  
      io.to(gameCode).emit("lobby-update", gameLobbies[gameCode]);
    }
  });

  
  socket.on("leave-lobby", (gameCode, username) => {
    if (gameLobbies[gameCode]) {
      gameLobbies[gameCode] = gameLobbies[gameCode].filter(user => user !== username);
      io.to(gameCode).emit("lobby-update", gameLobbies[gameCode]);
    }
    socket.leave(gameCode);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});