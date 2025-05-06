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
import { auth, db } from "../Firebase/firebase";
import { doc, setDoc, getDoc, increment, updateDoc } from "firebase/firestore";

//a div styled as pink and also centers everything in it when used
const AppContainer = styled.div`
  background-image: url("/Assets/PaperBackground.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0px;
  margin-bottom: 50px;
`;

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 600px;
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

const HoverCard = styled.div`
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-10px); /* Makes the card lift slightly on hover */
  }
`;

const ButtonContainer = styled.div`
  height: 40px;
  margin-top: 10px;
  margin-bottom: -80px;
  z-index: 3; /* z index is 3 because otherwise the buttons can't be clicked, the board covers it.*/
`;

const CurrentUserContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
`;

function Play() {
  const location = useLocation();
  const initialGameState = location.state;
  const { currentUser } = useAuth();
  const { gameCode: urlGameCode } = useParams();
  const [gameCode, setGameCode] = useState(urlGameCode || "");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedHandCard, setSelectedHandCard] = useState(null);
  useEffect(() => {
    socket.on("game-update", (gameState) => {
      console.log("Received game update");
      setBoard(gameState.board);
      setCards(gameState.hands[currentUser.email]);
      setCurrentPlayer(gameState.players[gameState.currentTurnIndex]);
      setWinner(gameState.winner);
    });
    socket.on("game-error", (error) => {
      if (typeof error === "string") {
        alert(error);
      } else if (error instanceof Error) {
        alert(error.message);
      } else {
        alert(JSON.stringify(error));
      }
    });
    return () => {
      socket.off("game-update");
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
      const updateStats = async () => {
        try {
          // 1) Bump the winner’s wins
          const winnerRef = doc(db, "users", winner.uid);
          await updateDoc(winnerRef, {
            wins: increment(1),
          });

          // 2) Bump each loser’s losses
          for (const player of initialGameState.players) {
            if (player.uid === winner.uid) continue;
            const loserRef = doc(db, "users", player.uid);
            await updateDoc(loserRef, {
              losses: increment(1),
            });
          }
        } catch (err) {
          console.error("Error updating win/loss:", err);
        }
      };

      updateStats();
    }
  }, [winner]);
  return (
    <AppContainer>
      <h1 style={{ width: "100%", height: "10px" }}>
        {winner ? winner.username : ""}
      </h1>
      <div
        style={{
          height: "100%",
          width: "98%",
          display: "flex",
          direction: "row",
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
        <CardContainer>
          {cards.map((card, index) => {
            const isSelected = selectedHandCard === card;

            return (
              <HoverCard
                key={index}
                // lift it permanently when selected
                style={{
                  transform: isSelected ? "translateY(-10px)" : undefined,
                }}
              >
                <div
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => {
                    // if it's selected, keep hovered; otherwise clear
                    if (isSelected) {
                      setHoveredCard(card);
                    } else {
                      setHoveredCard(null);
                    }
                  }}
                  onClick={() => {
                    // select + keep highlight
                    setSelectedHandCard(card);
                    setHoveredCard(card);
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <Card
                    rank={card.rank}
                    suit={card.suit}
                    highlighted={isSelected}
                  />
                </div>
              </HoverCard>
            );
          })}
        </CardContainer>
      </div>
      <HowToModal />
    </AppContainer>
  );
}

export default Play;
