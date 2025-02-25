import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";
import { Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
function Home() {
  const { currentUser } = useAuth(); 
  const [gameCode, setGameCode] = useState(""); 
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const navigate = useNavigate();

  const handleCreateGameClick = (e) =>{
    console.log("press")
    e.preventDefault();
    navigate("/createGame")

  }
  // useEffect(() => {

  //   socket.on("lobby-update", (users) => {
  //     setLobbyUsers(users);
  //   });

  //   return () => {
  //     socket.off("lobby-update");
  //   };
  // }, []);

  // const joinLobby = () => {
  //   console.log('HI')
  //   if (gameCode.trim() === "") return; 
  //   if (lobbyUsers.includes(currentUser.email)) return;
  
  //   socket.emit("join-lobby", gameCode, currentUser.email);
  // };

  return (
    <div style={{"backgroundImage":"url(/Assets/PaperBackground.jpg", "height":"100%", "backgroundRepeat": "no-repeat",
      "backgroundSize": "cover", 
      "display": "flex",  boxShadow: 3,}}>
      <div style={{"display":"flex", "flexDirection":"column", "width":"100%", "alignItems":"center", "marginTop":"6%", "justifyContent":"space-evenly", "marginTop":"2%"}}>
        <img src="/Assets/logo.gif" style={{"width":"33%", "height":"10%"}}></img>
        <div style={{"display":"flex", "flexDirection":"column", "justifyContent":"space-between", "alignItems":"center", "width":"35%", "height":"50%", "backgroundColor":"#4e3b31", "opacity":"93%", "borderRadius":"6px", boxShadow: "2px 4px 6px rgba(1, 1, 1, 1)",}}>
          <div style={{"height":"60%", "width":"100%", "alignItems":"center", "display":"flex", "flexDirection":"column", "marginTop":"3%"}}>
            <Avatar icon={<UserOutlined />} style={{"height":"65%", "width":"30%"}}></Avatar>
            <h2>{currentUser.username}</h2>
          </div> 
          <div style={{"height":"23%", "justifyContent":"space-between", "width":"100%", "display":"flex", "flexDirection":"column", "alignItems":"center", "marginBottom":"6%"}}>
            <button style={{"width":"80%", "backgroundColor":"#50c878"}} onClick={handleCreateGameClick}>Create a private game</button>
            <button style={{"width":"80%"}}>Join a game</button>
          </div>
          
        </div>
        {/* <input
          type="text"
          placeholder="Enter game code"
          value={gameCode}
          onChange={(e) => setGameCode(e.target.value)}
        />
        <h3>Players in Lobby:</h3>
        <ul>
          {lobbyUsers.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

export default Home;
