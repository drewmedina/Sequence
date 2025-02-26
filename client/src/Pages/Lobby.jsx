import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../Firebase/socket";
import "../Styling/Lobby.css";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

function Lobby() {
  const { gameCode } = useParams(); // Get game code from URL
  const [lobbyUsers, setLobbyUsers] = useState([]);

  useEffect(() => {
    // Join the lobby when component mounts
    socket.emit("join-lobby", gameCode);

    // Listen for updates to the player list
    socket.on("lobby-update", (users) => {
      setLobbyUsers(users);
    });

    return () => {
      socket.off("lobby-update");
    };
  }, [gameCode]);

  return (
    <div className="container">
      <div className="content">
        <h1>Game Lobby</h1>
        <p className="game-code">Game Code: {gameCode}</p>

        <div className="player-list">
          <h3>Players in Lobby:</h3>
          <ul>
            {lobbyUsers.map((user, index) => (
              <li key={index} className="player-item">
                <Avatar icon={<UserOutlined />} className="player-avatar" />
                {user}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Lobby;
