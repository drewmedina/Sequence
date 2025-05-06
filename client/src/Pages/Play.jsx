import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getCard,
  removeCardFromDeck,
  drawCard,
} from "../Components/GamePieces/Deck";
import Card from "../Components/GamePieces/Card";
import BoardImage from "../Components/BoardImage";
import DefaultGameBoard from "../Components/Board";
import Avatar from "antd/es/avatar/Avatar";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../Auth/AuthContext";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import socket from "../Firebase/socket";
import UserWaitingComponent from "../Components/UserWaitingComponent";
import MenuSettings from "../Components/MenuSettings";
import HowToModal from "../Components/HowTo";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
//a div styled as pink and also centers everything in it when used
const AppContainer = styled.div`
  background-image: url("/Assets/PaperBackground.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  height: 100%;
  display: flex;
  flex-direction: column;

  justify-content: space-evenly;
  align-items: center;

  padding-top: 2.5rem;
  padding-bottom: 2rem;
`;
const CardsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1px;
  padding-bottom: 2rem;
`;

const HoverCard = styled.div`
  transform: scale(0.9);
  transition: transform 0.2s, filter 0.2s;
  &:hover {
    transform: scale(1) translateY(-6px);
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.15));
    z-index: 5;
  }
`;

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const StyledBoardImage = styled.div`
  position: absolute;
  /* top: 0; */
  /* left: 0; */
  width: 85%;
  height: 75%;
  z-index: 1;
  pointer-events: none;
`;

const StyledGameBoard = styled.div`
  position: absolute;
  width: 85%;
  height: 75%;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Play() {
  const location = useLocation();
  const initialGameState = location.state;
  const { currentUser } = useAuth();
  const { gameCode: urlGameCode } = useParams();
  const [gameCode, setGameCode] = useState(urlGameCode || "");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedHandCard, setSelectedHandCard] = useState(null);
  const navigate = useNavigate();
  const [isWinnerModalVisible, setWinnerModalVisible] = useState(false);
  useEffect(() => {
    socket.on("game-update", (gameState) => {
      console.log("Received game update");
      setBoard(gameState.board);
      setCards(gameState.hands[currentUser.email]);
      setCurrentPlayer(gameState.players[gameState.currentTurnIndex]);
      setWinner(gameState.winner);
    });
    socket.on("game-error", (error) => {
      let msg;
      if (typeof error === "string") {
        msg = error;
      } else if (error instanceof Error) {
        msg = error.message;
      } else {
        msg = JSON.stringify(error);
      }
      toast.error(msg);
    });
    return () => {
      socket.off("game-update");
      socket.off("game-error");
    };
  }, [gameCode]);
  const [hand, setHand] = useState(initialGameState.deck);
  const [cards, setCards] = useState(initialGameState.hands[currentUser.email]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [board, setBoard] = useState(initialGameState.board);
  const [currentPlayer, setCurrentPlayer] = useState(
    initialGameState.players[initialGameState.currentTurnIndex]
  );
  const [winner, setWinner] = useState(null);

  const [discardPile, setDiscardPile] = useState([]);
  const discardCard = (index) => {
    const discardedCard = cards[index];
    setDiscardPile([...discardPile, cards[index]]); // Add to discard pile
    setCards(cards.filter((_, i) => i !== index)); // Remove from hand
    removeCardFromDeck(discardedCard);
  };

  useEffect(() => {
    if (selectedCard) {
      console.log("hi", selectedCard.row, selectedCard.col, selectedCard);
      socket.emit(
        "play-turn",
        gameCode,
        currentUser,
        selectedCard.row,
        selectedCard.col,
        selectedCard.joker
      );
    }
  }, [selectedCard]);
  useEffect(() => {
    if (winner) {
      setWinnerModalVisible(true);
    }
  }, [winner]);
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
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
      <AppContainer>
        <div style={{ height: "2%" }} />
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

          <BoardContainer>
            <StyledBoardImage>
              <BoardImage />
            </StyledBoardImage>
            <StyledGameBoard>
              <DefaultGameBoard
                hoveredCard={hoveredCard}
                boardData={board}
                setSelectedCard={setSelectedCard}
                selectedHandCard={selectedHandCard}
              />
            </StyledGameBoard>
          </BoardContainer>
        </div>

        <div style={{ padding: "2%", marginBottom: "2%" }}>
          <CardsRow>
            {cards.map((card, idx) => (
              <HoverCard
                key={idx}
                onMouseEnter={() => setHoveredCard(card)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setSelectedCard(card)}
                style={{ cursor: "pointer" }}
              >
                <Card
                  rank={card.rank}
                  suit={card.suit}
                  highlighted={selectedCard === card}
                />
              </HoverCard>
            ))}
          </CardsRow>
        </div>
      </AppContainer>
      <HowToModal />
    </>
  );
}

export default Play;
