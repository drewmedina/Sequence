const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();

const server = http.createServer(app);

app.use(cors());

/**
 * Initializes a WebSocket server using Socket.io.
 * @type {Server}
 */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

/**
 * Stores active game lobbies and their players.
 * @type {Object.<string, string[]>} - A dictionary where keys are game codes, and values are arrays of usernames.
 */
const gameLobbies = {};

/**
 * Event listener for new WebSocket connections.
 * Runs whenever a client connects to the server via WebSocket.
 */
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  /**
   * Handles when a player joins a game lobby.
   * 
   * @event join-lobby
   * @param {string} gameCode - The unique game lobby code.
   * @param {string} username - The username (or email) of the player joining.
   */
  socket.on("join-lobby", (gameCode, username) => {
    if (!gameLobbies[gameCode]) {
      gameLobbies[gameCode] = [];
    }
   
    // Ensure the user is not already in the lobby
    if (!gameLobbies[gameCode].includes(username)) {
      gameLobbies[gameCode].push(username);
      socket.join(gameCode);

      console.log(`${username} joined lobby ${gameCode}`);
      
      // Notify all players in the lobby about the updated player list
      io.to(gameCode).emit("lobby-update", gameLobbies[gameCode]);
    }
  });

  /**
   * Handles when a player leaves a game lobby.
   * 
   * @event leave-lobby
   * @param {string} gameCode - The game lobby code the player is leaving.
   * @param {string} username - The username of the player leaving.
   */
  socket.on("leave-lobby", (gameCode, username) => {
    
    // If the game lobby exists, remove the player from the list
    if (gameLobbies[gameCode]) {
      gameLobbies[gameCode] = gameLobbies[gameCode].filter(user => user !== username);
      io.to(gameCode).emit("lobby-update", gameLobbies[gameCode]);
    }
    socket.leave(gameCode);
  });

  /**
   * Handles when a player disconnects from the server.
   * 
   * @event disconnect
   */
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

/**
 * Starts the HTTP & WebSocket server.
 */
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});