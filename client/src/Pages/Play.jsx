import { useState } from "react";
import styled from "styled-components";
import { getCard } from "../Components/GamePieces/Deck";
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
    //const newCard = getCard();
    setCards(hand.getCards());
    //setCard(newCard);
  };


return (
  <AppContainer>
         <div>
       <button type="button" onClick={setRandomCard}>
         New Cards
       </button>
       {/* <Card rank={card.rank} suit={card.suit} /> */}
       <CardContainer>
          {cards.map((card, index) => (
            <HoverCard>
            <Card key={index} rank={card.rank} suit={card.suit} />
            </HoverCard>
          ))}
        </CardContainer>
     </div>
  </AppContainer>
);
 }

export default Play
