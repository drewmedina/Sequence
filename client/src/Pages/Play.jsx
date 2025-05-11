// Play.jsx
import React, { useEffect, useState } from "react";
import Card from "../Components/GamePieces/Card";
import BoardImage from "../Components/BoardImage";
import DefaultGameBoard from "../Components/Board";
import { useAuth } from "../Auth/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import socket from "../Firebase/socket";
import UserWaitingComponent from "../Components/UserWaitingComponent";
import HowToModal from "../Components/HowTo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "antd";

function Play() {
  const location = useLocation();
  const initialGameState = location.state; // Game state passed via navigation
  const { currentUser } = useAuth();
  const { gameCode: urlGameCode } = useParams();
  const [gameCode] = useState(urlGameCode || "");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedHandCard, setSelectedHandCard] = useState(null);
  const navigate = useNavigate();
  const [isWinnerModalVisible, setWinnerModalVisible] = useState(false);
  const [cards, setCards] = useState(initialGameState.hands[currentUser.email]);
  const [board, setBoard] = useState(initialGameState.board);
  const [currentPlayer, setCurrentPlayer] = useState(
    initialGameState.players[initialGameState.currentTurnIndex]
  );
  const [winner, setWinner] = useState(null);

  // Listen for game updates and errors
  useEffect(() => {
    socket.on("game-update", (gameState) => {
      setBoard(gameState.board);
      setCards(gameState.hands[currentUser.email]);
      setCurrentPlayer(gameState.players[gameState.currentTurnIndex]);
      setWinner(gameState.winner);
    });
    socket.on("game-error", (error) => {
      const msg =
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : JSON.stringify(error);
      toast.error(msg);
    });
    return () => {
      socket.off("game-update");
      socket.off("game-error");
    };
  }, [gameCode]);

  // Emit turn when a hand card is selected
  useEffect(() => {
    if (selectedHandCard) {
      socket.emit(
        "play-turn",
        gameCode,
        currentUser,
        selectedHandCard.row,
        selectedHandCard.col,
        selectedHandCard.joker
      );
    }
  }, [selectedHandCard]);

  // Show winner modal when game ends
  useEffect(() => {
    if (winner) setWinnerModalVisible(true);
  }, [winner]);

  // Inline style objects for layout
  const appContainerStyle = {
    backgroundImage: 'url("/Assets/PaperBackground.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingTop: "2.5rem",
    paddingBottom: "2rem",
  };

  const cardContainerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "0px",
    marginBottom: "50px",
  };

  const boardContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  };

  const boardImageStyle = {
    position: "absolute",
    width: "85%",
    height: "75%",
    zIndex: 1,
    pointerEvents: "none", // Let clicks pass through the image
  };

  const gameBoardStyle = {
    position: "absolute",
    width: "85%",
    height: "75%",
    zIndex: 2,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardWrapperBase = {
    transform: "scale(0.9)",
    transition: "transform 0.2s, filter 0.2s",
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Winner modal appears when a player wins */}
      <Modal
        title="Game Over"
        open={isWinnerModalVisible}
        getContainer={() => document.body}
        onOk={() => navigate("/")}
        onCancel={() => navigate("/")}
        okText="Back to Home"
        cancelButtonProps={{ style: { display: "none" } }}
        centered
        style={{ top: 20 }}
      >
        <p style={{ textAlign: "center", margin: 0, fontSize: 18 }}>
          {winner?.username} has won the game!
        </p>
      </Modal>

      <div style={appContainerStyle}>
        <div style={{ height: "2%" }} />

        {/* Top row: other players */}
        <div
          style={{
            display: "flex",
            width: "98%",
            height: "100%",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            {initialGameState.players.map((player) => (
              <UserWaitingComponent
                key={player.email}
                user={player}
                isCurrentTurn={currentPlayer.email === player.email}
              />
            ))}
          </div>

          {/* Game board area */}
          <div style={boardContainerStyle}>
            <div style={boardImageStyle}>
              <BoardImage />
            </div>
            <div style={gameBoardStyle}>
              <DefaultGameBoard
                hoveredCard={hoveredCard}
                boardData={board}
                setSelectedCard={setSelectedHandCard}
                selectedHandCard={selectedHandCard}
              />
            </div>
          </div>
        </div>

        {/* Player's hand */}
        <div style={{ padding: "2%", marginBottom: "2%" }}>
          <div style={cardContainerStyle}>
            {cards.map((card, index) => {
              const isHovered = hoveredCard === card;
              const isSelected = selectedHandCard === card;
              const wrapperStyle = {
                ...cardWrapperBase,
                ...(isSelected
                  ? { transform: "translateY(-10px)" }
                  : isHovered
                  ? {
                      transform: "scale(1) translateY(-6px)",
                      filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15))",
                      zIndex: 5,
                    }
                  : {}),
              };
              return (
                <div key={index} style={wrapperStyle}>
                  <div
                    onMouseEnter={() => setHoveredCard(card)}
                    onMouseLeave={() => {
                      if (selectedHandCard !== card) setHoveredCard(null);
                    }}
                    onClick={() => {
                      setSelectedHandCard(card);
                      setHoveredCard(card);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Card
                      rank={card.rank}
                      suit={card.suit}
                      highlighted={isSelected}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* How-to-play modal trigger */}
      <HowToModal />
    </>
  );
}

export default Play;
