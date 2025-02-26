import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";
import { Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import "../Styling/Home.css";

function Home() {
  const { currentUser } = useAuth(); 
  const [gameCode, setGameCode] = useState(""); 
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();


  const handleCreateGameClick = (e) =>{
    console.log("press")
    e.preventDefault();
    navigate("/createGame")
  }
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

  const createGame = () => {
    setError(""); 
    socket.emit("create-game", currentUser.email);
  };

  // Called when "Join a Game" is clicked
  const handleJoinClick = () => {
    setIsJoining(true); // Show the input field instead of button
  };

  // Called when user presses Enter after entering a game code
  const handleJoinLobby = (e) => {
    if (e.key === "Enter") {
      if (gameCode.trim() === "" || lobbyUsers.includes(currentUser.email)) return;
      socket.emit("join-lobby", gameCode, currentUser.email);
      navigate(`/lobby/${gameCode}`);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <img src="/Assets/logo.gif" alt="Logo" className="logo" />
        <div className="lobby-container">
          <div className="avatar-container">
            <Avatar icon={<UserOutlined />} className="avatar" />
            <h2 className="username">{currentUser.username}</h2>
          </div>
          <div className="buttons-container">
            
            <button className="button create-button" onClick={handleCreateGameClick}>
              Create a private game
            </button>

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
        </div>
      </div>
    </div>
  );
}

export default Home;
