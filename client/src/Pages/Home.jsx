import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../Styling/Home.css";


function Home() {
  const { currentUser } = useAuth();
  useEffect(() => {
    console.log("Current user updated:", currentUser);
  }, [currentUser]);
  
  const [gameCode, setGameCode] = useState("");
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();


  const handleCreateGameClick = (e) => {
    console.log("press");
    e.preventDefault();
    createGame();
  };
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
      navigate(`/createGame/${newGameCode}`);
      setError("");
    });

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("lobby-update");
      socket.off("lobby-full");
      socket.off("lobby-error");
      socket.off("game-created");
    };
  }, []);

  const createGame = () => {
    if (!currentUser || !currentUser.email) {
      setError("Error: User not logged in.");
      console.error("Error: currentUser is undefined or has no email.");
      return;
    }
    console.log(`Creating game for user: ${currentUser.username}`);
    socket.emit("create-game", currentUser);
  };

  // Called when "Join a Game" is clicked
  const handleJoinClick = () => {
    setIsJoining(true); // Show the input field instead of button
  };

  // Called when user presses Enter after entering a game code
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
        <img src="/Assets/logo.gif" alt="Logo" className="logo" />
        <div className="lobby-container">
          <div className="avatar-container">
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
            <button
              className="button create-button"
              onClick={handleCreateGameClick}
            >
              Create a private game
            </button>

            {!isJoining ? (
              <button
                variant="outlined"
                className="button join-button"
                onClick={handleJoinClick}
              >
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
        </div>
      </div>
    </div>
  );
}

export default Home;
