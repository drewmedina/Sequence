import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  getCard,
  removeCardFromDeck,
  drawCard,
} from "../Components/GamePieces/Deck";
import Card from "../Components/GamePieces/Card";
import Hand from "../Components/GamePieces/Hand";
import BoardImage from "../Components/BoardImage";
import DefaultGameBoard from "../Components/Board";
import Avatar from "antd/es/avatar/Avatar";
import { UserOutlined } from "@ant-design/icons";
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
  position: absolute;
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
  width: 80%;
  height: 85%;
  z-index: 1;
  pointer-events: none;
`;

const StyledGameBoard = styled.div`
  position: absolute;
  width: 80%;
  height: 85%;
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
const startingBoard = [
  ["FX", "A♦", "K♦", "Q♦", "10♦", "9♦", "8♦", "7♦", "6♦", "FX"],
  ["A♣", "7♠", "6♠", "5♠", "4♠", "3♠", "2♠", "2♥", "3♥", "5♦"],
  ["K♣", "8♠", "10♣", "Q♣", "K♣", "A♣", "A♦", "K♦", "4♥", "4♦"],
  ["Q♣", "9♠", "9♣", "8♥", "9♥", "10♥", "Q♥", "Q♦", "5♥", "3♦"],
  ["10♣", "10♠", "8♣", "7♥", "2♥", "3♥", "K♥", "10♦", "6♥", "2♦"],
  ["9♣", "Q♠", "7♣", "6♥", "5♥", "4♥", "A♥", "9♦", "7♥", "A♠"],
  ["8♣", "K♠", "6♣", "5♣", "4♣", "3♣", "2♣", "8♦", "8♥", "K♠"],
  ["7♣", "A♠", "2♦", "3♦", "4♦", "5♦", "6♦", "7♦", "9♥", "Q♠"],
  ["6♣", "5♣", "4♣", "3♣", "2♣", "A♥", "K♥", "Q♥", "10♥", "10♠"],
  ["FX", "2♠", "3♠", "4♠", "5♠", "6♠", "7♠", "8♠", "9♠", "FX"],
];
//gap: 1rem; /* Adjust space between cards */
function Play() {
  const hand = Hand();
  const [cards, setCards] = useState(hand.getCards());
  const [selectedCard, setSelectedCard] = useState(null);
  const [board, setBoard] = useState(startingBoard);
  const setRandomCard = () => {
    setCards([
      getCard(),
      getCard(),
      getCard(),
      getCard(),
      getCard(),
      getCard(),
      getCard(),
    ]);
  };

  const [discardPile, setDiscardPile] = useState([]);
  const discardCard = (index) => {
    const discardedCard = cards[index];
    setDiscardPile([...discardPile, cards[index]]); // Add to discard pile
    setCards(cards.filter((_, i) => i !== index)); // Remove from hand
    removeCardFromDeck(discardedCard);
  };

  const drawCardFromDeck = () => {
    const newCard = drawCard(); // Draw a card from the deck
    setCards((prevCards) => [...prevCards, newCard]); // Add the new card to the hand
  };
  useEffect(() => {
    if (selectedCard) {
      console.log("hello", selectedCard);
      var new_board = board;
      new_board[selectedCard.row][selectedCard.col] =
        board[selectedCard.row][selectedCard.col] + "#000000";
      setBoard(new_board);
    }
  }, [selectedCard]);
  return (
    <AppContainer>
      
      <ButtonContainer>
        <button type="button" onClick={setRandomCard}>
          {" "}
          New Cards{" "}
        </button>
        <button type="button" onClick={drawCardFromDeck}>
          {" "}
          Draw Card{" "}
        </button>
        
      </ButtonContainer>
      {/* <MenuSettings></MenuSettings> */}
      <div
        style={{
          height: "100%",
          width: "90%",
          display: "flex",
          direction: "row",
          alignItems: "center",
        }}
      >
        
        <UserWaitingComponent user={{ username: "Anisha" }} />
       

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
        
        <UserWaitingComponent user={{ username: "Anisha" }} />
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
    </AppContainer>
  );
}

export default Play;
