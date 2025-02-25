import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";
import "../Styling/Home.css";

function Home() {
  const { currentUser } = useAuth(); 
  const [gameCode, setGameCode] = useState(""); 
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {

    // Listen for updates to the lobby
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
      setGameCode(newGameCode);
      setError("");
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
    <div className="home-container">
      <h2>Welcome, {currentUser?.email}!</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter game code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
          className="game-code-input"
        />

        <button onClick={joinLobby} className="button join-button">
          Join Lobby
        </button>

        <button onClick={createGame} className="button create-button">
          Create New Game
        </button>
      </div>

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
