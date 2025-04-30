import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import UserWaitingComponent from "../Components/UserWaitingComponent";
import "../Styling/CreateGamePage.css";
import { Slider, Row, Col, InputNumber, Button } from "antd";
import { NumberOutlined, FieldTimeOutlined } from "@ant-design/icons";
function CreateGamePage() {
  const { currentUser } = useAuth();
  const { gameCode: urlGameCode } = useParams();
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [sequencesNeeded, setSequencesNeeded] = useState(1);
  const [timePerMove, setTimePerMove] = useState(30);
  const [gameCode, setGameCode] = useState(urlGameCode || "");

  const navigate = useNavigate();
  useEffect(() => {
    if (!gameCode) {
      socket.on("game-created", (generatedCode) => {
        console.log("Game created with code:", generatedCode);
        setGameCode(generatedCode);
      });
    }

    socket.emit("get-players", gameCode);
    socket.on("lobby-update", (users) => {
      console.log("Received lobby update:", users);
      setLobbyUsers(users);
    });
    socket.on("game-starting", (gameData) => {
      console.log("Game started!", gameData);
      navigate(`/play/${gameCode}`, { state: gameData });
    });
    return () => {
      socket.off("game-starting");
      socket.off("lobby-update");
      socket.off("game-created");
    };
  }, [gameCode]);

  const handleSequenceChange = (e) => {
    setSequencesNeeded(Number(e));
  };

  const handleTimeChange = (e) => {
    setTimePerMove(Number(e));
  };

  const handleStartGame = (e) => {
    socket.emit("start-game", gameCode);
  };

  const handleLeaveGame = (e) => {
    socket.emit("leave-lobby", gameCode, currentUser);
    navigate("/");
  };
  return (
    <div className="create-game-container">
      <div className="game-code-box">
        <h2>
          Game Code:{" "}
          <span style={{ color: "#f7fdad" }}>
            {gameCode || "Generating..."}
          </span>
        </h2>
      </div>

      <div
        className="title"
        style={{
          width: "80%",
          height: "10%",
          backgroundColor: "#FFFFFF",
          borderRadius: "6px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {lobbyUsers.length === 3 ? (
          <h2 style={{ color: "#000000" }}>
            Waiting For Leader to Start the Game
          </h2>
        ) : (
          <h2 style={{ color: "#000000" }}>
            Waiting for Players to join the lobby
          </h2>
        )}
      </div>
      <div className="game-lobby">
        <div className="current-players-box">
          {lobbyUsers.length > 0 ? (
            lobbyUsers.map((user, index) => (
              <UserWaitingComponent user={user} key={index} />
            ))
          ) : (
            <p>No players in lobby</p>
          )}
        </div>
        <div className="lobby-box">
          <div className="settings-box">
            <div className="settings-top-section">
              <div className="settings-header">
                <h2>Game Settings</h2>
              </div>
              <div className="sequences">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "31%",
                  }}
                >
                  <NumberOutlined />
                  <label>Number of Sequences:</label>
                </div>
                <InputNumber
                  min={1}
                  max={2}
                  style={{ margin: "0 16px" }}
                  value={sequencesNeeded}
                  onChange={handleSequenceChange}
                />
              </div>
              <div className="time-per-move">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "22%",
                  }}
                >
                  <FieldTimeOutlined />
                  <label>Time per move:</label>
                </div>
                <div className="slider">
                  <Slider
                    min={30}
                    max={120}
                    onChange={handleTimeChange}
                    value={typeof timePerMove === "number" ? timePerMove : 0}
                  />
                </div>
                <div>
                  <InputNumber
                    min={30}
                    max={120}
                    style={{ margin: "0 16px" }}
                    value={timePerMove}
                    onChange={handleTimeChange}
                  />
                </div>
              </div>
            </div>
            <div className="buttons">
              <Button
                disabled={lobbyUsers.length < 3}
                onClick={handleStartGame}
                color="green"
                variant="solid"
              >
                Start Game!
              </Button>
              <Button onClick={handleLeaveGame}>Leave the Game😡</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGamePage;
