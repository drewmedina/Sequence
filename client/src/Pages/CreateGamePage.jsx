// CreateGamePage.jsx
import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import CreateGameUserComponent from "../Components/CreateGameUserComponent";
import "../Styling/CreateGamePage.css";
import { Slider, InputNumber, Button } from "antd";
import { NumberOutlined, FieldTimeOutlined } from "@ant-design/icons";
import HowToModal from "../Components/HowTo";

function CreateGamePage() {
  const { currentUser } = useAuth();
  const { gameCode: urlGameCode } = useParams();
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [sequencesNeeded, setSequencesNeeded] = useState(1);
  const [timePerMove, setTimePerMove] = useState(30);
  const [gameCode, setGameCode] = useState(urlGameCode || "");

  const navigate = useNavigate();

  // Establish socket listeners and fetch initial lobby/users when component mounts or gameCode changes
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

  // Handler for changing how many sequences are needed
  const handleSequenceChange = (e) => {
    setSequencesNeeded(Number(e));
  };

  // Handler for changing time per move via slider or input
  const handleTimeChange = (e) => {
    setTimePerMove(Number(e));
  };

  // Emit event to start the game when ready
  const handleStartGame = (e) => {
    socket.emit("start-game", gameCode);
  };

  // Leave the lobby and navigate home
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
          backgroundColor: "#fff8dc",
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
          <h2 style={{ color: "#5e3b1e" }}>
            Waiting for players to join the lobby...
          </h2>
        )}
      </div>
      <div className="game-lobby">
        <div className="current-players-box">
          {lobbyUsers.length > 0 ? (
            lobbyUsers.map((user, index) => (
              <CreateGameUserComponent user={user} key={index} />
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
                    alignItems: "center",
                    gap: "0.5rem",
                    width: "fit-content",
                  }}
                >
                  <NumberOutlined />
                  <label>Number of Sequences:</label>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  {[1, 2].map((val) => (
                    <Button
                      key={val}
                      type={sequencesNeeded === val ? "primary" : "default"}
                      onClick={() => handleSequenceChange(val)}
                      style={{
                        width: 48,
                        height: 40,
                        fontWeight: "bold",
                        backgroundColor:
                          sequencesNeeded === val ? "#5f9341" : "#fff8dc",
                        borderColor: "#b08c5a",
                        color: sequencesNeeded === val ? "white" : "#5a3e2b",
                      }}
                    >
                      {val}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="time-per-move">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    width: "fit-content",
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
                type="primary"
              >
                Start Game!
              </Button>

              <Button className="leave-button" onClick={handleLeaveGame}>
                Leave the Game
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Include HowToModal icon and modal */}
      <HowToModal />
    </div>
  );
}

export default CreateGamePage;
