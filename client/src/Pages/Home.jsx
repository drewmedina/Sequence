import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";

function Home() {
  const { currentUser } = useAuth(); 
  const [gameCode, setGameCode] = useState(""); 
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [error, setError] = useState(""); // Store error messages

  useEffect(() => {

    socket.on("lobby-update", (users) => {
      setLobbyUsers(users);
    });

    // Listen for errors (full lobby or invalid lobby)
    socket.on("lobby-full", (message) => {
      setError(message);
    });
    socket.on("lobby-error", (message) => {
      setError(message);
    });

    // Listen for created game codes
    socket.on("game-created", (newGameCode) => {
      setGameCode(newGameCode); // Set the game code automatically
      setError(""); // Clear any error messages
    });

    return () => {
      socket.off("lobby-update");
      socket.off("lobby-full");
      socket.off("lobby-error");
      socket.off("game-created");
    };
  }, []);

  const joinLobby = () => {
    if (gameCode.trim() === "") return; 
    if (lobbyUsers.includes(currentUser.email)) return;
  
    socket.emit("join-lobby", gameCode, currentUser.email);
  };

  const createGame = () => {
    setError(""); 
    socket.emit("create-game", currentUser.email);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Welcome, {currentUser?.email}!</h2>

      {/* Show error message if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Input and Button Wrapping Div */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        {/* Game Code Input */}
        <input
          type="text"
          placeholder="Enter game code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            fontSize: "16px",
            textAlign: "center"
          }}
        />
        {/* Join Lobby Button */}
        <button 
          onClick={joinLobby}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Join Lobby
        </button>
        
        {/* Create Game Button */}
        <button 
          onClick={createGame}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Create New Game
        </button>
      </div>

      {/* List of Players */}
      <h3>Players in Lobby:</h3>
      <ul>
        {lobbyUsers.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
