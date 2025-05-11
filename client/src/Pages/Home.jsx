// Home.jsx
import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../Styling/Home.css";
import HowToModal from "../Components/HowTo";

function Home() {
  const { currentUser } = useAuth();
  const [gameCode, setGameCode] = useState("");
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  // Log whenever currentUser changes (for debugging)
  useEffect(() => {
    console.log("Current user updated:", currentUser);
  }, [currentUser]);

  // Set up socket listeners on mount, and clean up on unmount
  useEffect(() => {
    console.log("Setting up socket listeners...");

    socket.on("lobby-update", (users) => {
      console.log("Lobby updated:", users);
      setLobbyUsers(users);
    });

    socket.on("lobby-full", (message) => {
      console.log("Lobby full:", message);
      setError(message);
    });

    socket.on("lobby-error", (message) => {
      console.log("Lobby error:", message);
      setError(message);
    });

    socket.on("game-created", (newGameCode) => {
      console.log(`Game created: ${newGameCode}`);
      setGameCode(newGameCode);
      navigate(`/createGame/${newGameCode}`); // Navigate to lobby page
      setError("");
    });

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("lobby-update");
      socket.off("lobby-full");
      socket.off("lobby-error");
      socket.off("game-created");
    };
  }, [navigate]);

  // Emit create-game event to server
  const createGame = () => {
    if (!currentUser || !currentUser.email) {
      setError("Error: User not logged in.");
      console.error("Error: currentUser is undefined or has no email.");
      return;
    }
    console.log(`Creating game for user: ${currentUser.username}`);
    socket.emit("create-game", currentUser);
  };

  // Button click handler to start creating a game
  const handleCreateGameClick = (e) => {
    e.preventDefault();
    createGame();
  };

  // Show the input field to enter a game code
  const handleJoinClick = () => {
    setIsJoining(true);
  };

  // Handle Enter key in join input to attempt joining lobby
  const handleJoinLobby = (e) => {
    if (e.key === "Enter") {
      if (!currentUser || !currentUser.email) {
        setError("Error: User not logged in.");
        console.error("Error: currentUser is undefined or has no email.");
        return;
      }
      if (gameCode.trim() === "" || lobbyUsers.includes(currentUser.username))
        return;
      socket.emit("join-lobby", gameCode, currentUser);
      navigate(`/createGame/${gameCode}`);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        {/* Animated logo */}
        <img src="/Assets/logo.gif" alt="Logo" className="logo" />

        <div className="lobby-container">
          <div className="avatar-container">
            {/* Display user avatar or default icon */}
            {currentUser && (
              <Avatar
                size={64}
                src={currentUser.avatar}
                icon={!currentUser.avatar && <UserOutlined />}
                className="avatar"
                alt="User avatar"
              />
            )}
            <h2 className="username">{currentUser.username}</h2>
          </div>

          <div className="buttons-container">
            {/* Create game button */}
            <button
              className="button create-button"
              onClick={handleCreateGameClick}
            >
              Create a private game
            </button>

            {/* Join game input or button */}
            {!isJoining ? (
              <button className="button join-button" onClick={handleJoinClick}>
                Join a game
              </button>
            ) : (
              <input
                type="text"
                className="join-input"
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value)}
                onKeyDown={handleJoinLobby}
                autoFocus
              />
            )}
          </div>

          {/* Display any error messages */}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {/* How-to-play modal trigger */}
      <HowToModal />
    </div>
  );
}

export default Home;
