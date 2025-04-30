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

//a div styled as pink and also centers everything in it when used
const AppContainer = styled.div`
  background-image: url(Assets/PaperBackground.jpg);
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
  width: 60%;
  height: 65%;
  z-index: 1;
  pointer-events: none;
`;

const StyledGameBoard = styled.div`
  position: absolute;
  width: 60%;
  height: 65%;
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
      console.log(selectedCard.row, selectedCard.col);
      socket.emit(
        "play-turn",
        gameCode,
        currentUser,
        selectedCard.row,
        selectedCard.col
      );
    }
  }, [selectedCard]);
  useEffect(() => {
    if (winner) {
      console.log("winner", winner.email);
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
          }}
        >
          {initialGameState.players
            .filter((player) => player.email !== currentUser.email)
            .slice(0, Math.ceil((initialGameState.players.length - 1) / 2)) // First half
            .map((player, index) => (
              <UserWaitingComponent
                key={index}
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
              boardData={board}
              setSelectedCard={setSelectedCard}
            />
          </StyledGameBoard>
        </BoardContainer>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {initialGameState.players
            .filter((player) => player.email !== currentUser.email)
            .slice(Math.ceil((initialGameState.players.length - 1) / 2)) // Second half
            .map((player, index) => (
              <UserWaitingComponent
                key={index + 1000} // different key space from left column
                user={player}
                isCurrentTurn={currentPlayer.email === player.email}
              />
            ))}
        </div>
      </div>

      <div>
        <CardContainer>
          {cards.map((card, index) => (
            <HoverCard key={index}>
              <div
                onClick={() => discardCard(index)}
                style={{ cursor: "pointer" }}
              >
                <Card key={index} rank={card.rank} suit={card.suit} />
              </div>
            </HoverCard>
          ))}
        </CardContainer>
      </div>
      <CurrentUserContainer>
        <UserWaitingComponent
          user={currentUser}
          isCurrentTurn={currentPlayer.email === currentUser.email}
        />
      </CurrentUserContainer>
    </AppContainer>
  );
}

export default Play;
