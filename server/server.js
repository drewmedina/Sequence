import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { GameState } from "./GameState.js";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "./firebaseAdmin.js";
import admin from "firebase-admin";
const PORT = process.env.PORT || 3001;
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://sequence-client.onrender.com",
  "https://sequence.baby",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  })
);

/**
 * Initializes a WebSocket server using Socket.io.
 * @type {Server}
 */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ error: "Internal server error" });
});

/**
 * Initializes a WebSocket server using Socket.io.
 * @type {Server}
 */

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

/**
 * Stores active game lobbies and their players.
 * @type {Object.<string, string[]>} - A dictionary where keys are game codes, and values are arrays of usernames.
 */
const gameLobbies = {
  ABC123: [],
};

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
    if (!username) {
      console.error(
        `Error: create-game event received with undefined username. ${socket.id}`
      );
      socket.emit("lobby-error", "Invalid username.");
      return;
    }
    // Create the lobby and add the first player
    gameLobbies[gameCode] = new GameState([username]);
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
    console.log(`User ${username} is trying to join game ${gameCode}`);
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
    if (!gameLobbies[gameCode].getPlayers().includes(username)) {
      gameLobbies[gameCode].addPlayer(username);
      socket.join(gameCode);
      console.log(`${username} successfully joined lobby ${gameCode}`);
      console.log(
        `🔵 Emitting lobby-update with users:`,
        gameLobbies[gameCode].getPlayers()
      );
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
      gameLobbies[gameCode].players = gameLobbies[gameCode].players.filter(
        (user) => user !== username
      );
      io.to(gameCode).emit("lobby-update", gameLobbies[gameCode]);
    }
    socket.leave(gameCode);
  });

  socket.on("get-players", (gameCode) => {
    if (gameLobbies[gameCode]) {
      io.to(gameCode).emit("lobby-update", gameLobbies[gameCode].getPlayers());
    }
  });
  socket.on("start-game", (gameCode) => {
    if (
      gameLobbies[gameCode] &&
      gameLobbies[gameCode].getPlayers().length == 3
    ) {
      gameLobbies[gameCode].gameStarted = true;
      io.to(gameCode).emit("game-starting", gameLobbies[gameCode]);
    }
  });
  socket.on("play-turn", async (gameCode, username, row, col, joker) => {
    if (gameLobbies[gameCode] && gameLobbies[gameCode].gameStarted) {
      try {
        console.log("attempting to play", row, col, joker);
        if (!row || !col) {
          return;
        }
        gameLobbies[gameCode].playCard(username, row, col, joker);
        console.log("winner?", gameLobbies[gameCode].winner);
        let winner = gameLobbies[gameCode].winner;
        if (winner) {
          try {
            // Build an Admin DocumentReference:
            const winnerRef = db.collection("users").doc(winner.uid);
            await winnerRef.update({
              wins: admin.firestore.FieldValue.increment(1),
            });
            // And for each loser:
            for (const player of gameLobbies[gameCode].players) {
              if (player.uid === winner.uid) continue;
              const loserRef = db.collection("users").doc(player.uid);
              await loserRef.update({
                losses: admin.firestore.FieldValue.increment(1),
              });
            }
          } catch (err) {
            console.error("Error updating win/loss:", err);
          }
        }
        io.to(gameCode).emit("game-update", gameLobbies[gameCode]);
      } catch (e) {
        console.log("fail", e);
        socket.emit("game-error", e.message || "An unknown error occurred.");
      }
    }
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
