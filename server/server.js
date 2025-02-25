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
 * Generates a unique 6-character game code.
 * @returns {string} A randomly generated game code.
 */
function generateGameCode() {
  let gameCode;
  do {
    gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (gameLobbies[gameCode]);
  return gameCode;
}

/**
 * Event listener for new WebSocket connections.
 * Runs whenever a client connects to the server via WebSocket.
 */
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  /**
   * Generates a unique game code and creates a new game lobby.
   * 
   * @event create-game
   * @param {string} username - The player who is creating the game.
   */
  socket.on("create-game", (username) => {
    const gameCode = generateGameCode();

    // Create the lobby and add the first player
    gameLobbies[gameCode] = [username];
    socket.join(gameCode);
    console.log(`Game created with code ${gameCode} by ${username}`);
    io.to(gameCode).emit("lobby-update", gameLobbies[gameCode]);
    socket.emit("game-created", gameCode);
  });

  /**
   * Handles when a player joins a game lobby.
   * 
   * @event join-lobby
   * @param {string} gameCode - The unique game lobby code.
   * @param {string} username - The username (or email) of the player joining.
   */
  socket.on("join-lobby", (gameCode, username) => {
    console.log(`User ${username} is trying to join game ${gameCode}`); // Debugging log

    // Check if the game lobby exists
    if (!gameLobbies[gameCode]) {
        console.log(`Lobby ${gameCode} does not exist!`);
        socket.emit("lobby-error", "Game lobby does not exist.");
        return;
    }

    // Check if the lobby is full
    if (gameLobbies[gameCode].length >= 3) {
        console.log(`Lobby ${gameCode} is full.`);
        socket.emit("lobby-full", "This lobby is full. Please try another game.");
        return;
    }

    // Ensure the user is not already in the lobby
    if (!gameLobbies[gameCode].includes(username)) {
        gameLobbies[gameCode].push(username);
        socket.join(gameCode);
        console.log(`${username} successfully joined lobby ${gameCode}`);

        // Notify all players in the lobby
        io.to(gameCode).emit("lobby-update", gameLobbies[gameCode]);
    } else {
        console.log(`${username} is already in lobby ${gameCode}`);
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