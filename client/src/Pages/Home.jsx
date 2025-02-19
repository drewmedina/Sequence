import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";

function Home() {
  const { currentUser } = useAuth(); 
  const [gameCode, setGameCode] = useState(""); 
  const [lobbyUsers, setLobbyUsers] = useState([]);

  useEffect(() => {

    socket.on("lobby-update", (users) => {
      setLobbyUsers(users);
    });

    return () => {
      socket.off("lobby-update");
    };
  }, []);

  const joinLobby = () => {
    if (gameCode.trim() === "") return; 
    if (lobbyUsers.includes(currentUser.email)) return;
  
    socket.emit("join-lobby", gameCode, currentUser.email);
  };

  return (
    <div>
      <h2>Welcome, {currentUser?.email}!</h2>

      <div>
        <input
          type="text"
          placeholder="Enter game code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
        />
        <button onClick={joinLobby}>Join Lobby</button>
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
