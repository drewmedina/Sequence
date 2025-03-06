import { useState } from "react";
import styled from "styled-components";
import { getCard, removeCardFromDeck, drawCard } from "../Components/GamePieces/Deck";
import Card from "../Components/GamePieces/Card"
import Hand from "../Components/GamePieces/Hand"; 

//a div styled as pink and also centers everything in it when used
const AppContainer = styled.div`
  background-color: pink;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0px;
`;

const HoverCard = styled.div`
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-10px); /* Makes the card lift slightly on hover */
  }
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
         <div>
       <button type="button" onClick={setRandomCard}>
         New Cards
       </button>
       <button type="button" onClick={drawCardFromDeck}>
          Draw Card
        </button>
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
