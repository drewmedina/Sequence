import { useState } from "react";
import styled from "styled-components";
import { getCard, removeCardFromDeck, drawCard } from "../Components/GamePieces/Deck";
import Card from "../Components/GamePieces/Card"
import Hand from "../Components/GamePieces/Hand"; 
import BoardImage from "../Components/BoardImage"; 
import DefaultGameBoard from "../Components/Board";


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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 980px;
  height: 750px; 
  margin-top: -100px;
  margin-left: 380px;
`;

const StyledBoardImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
`;

const StyledGameBoard = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  margin-bottom: 110px;
  margin-left: 202px;
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
  z-index: 3;  /* z index is 3 because otherwise the buttons can't be clicked, the board covers it.*/

`;





//gap: 1rem; /* Adjust space between cards */
function Play() {
  
  const hand = Hand();
  const [cards, setCards] = useState(hand.getCards());

  //gets a new random card
  const setRandomCard = () => {
      setCards([
        getCard(), getCard(), getCard(), getCard(), getCard(), getCard(), getCard()
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

return (
  
  <AppContainer>
    <ButtonContainer>
          <button type="button" onClick={setRandomCard}> New Cards </button>
          <button type="button" onClick={drawCardFromDeck}> Draw Card </button>

      </ButtonContainer>
    <BoardContainer>
      <StyledBoardImage>
        <BoardImage />
      </StyledBoardImage>
    
      <StyledGameBoard>
          <DefaultGameBoard />
      </StyledGameBoard>
    </BoardContainer>

    <div>
         
       
       {/* <Card rank={card.rank} suit={card.suit} /> */}
       

       <CardContainer>
          {cards.map((card, index) => (
            <HoverCard key = {index}>
            <div onClick={() => discardCard(index)} style={{ cursor: "pointer" }}>
            <Card key = {index} rank={card.rank} suit={card.suit} />
            </div>
            </HoverCard>
          ))}
        </CardContainer>
     </div>
  </AppContainer>
);
 }

export default Play
