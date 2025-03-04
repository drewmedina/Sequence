import { useState } from "react";
import styled from "styled-components";
import { getCard } from "../Components/GamePieces/Deck";
import Card from "../Components/GamePieces/Card"

const AppContainer = styled.div`
  background-color: pink;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.p`
  font-size: 2rem;
  color: white;
`;

function Play() {
  
    
//     const [card, setCard] = useState(getCard());

//   const setRandomCard = () => {
//     const newCard = getCard();
//     setCard(newCard);
//   };

//   return (
//     <div>
//       <button type="button" onClick={setRandomCard}>
//         New Card{" "}
//       </button>
//       <Card rank={card.rank} suit={card.suit} />
//     </div>
//   );
//-------------
// const [card, setCard] = useState(getCard());

//   const setRandomCard = () => {
//     const newCard = getCard();
//     setCard(newCard);
//   };

//   return (
//     <AppContainer>
//       <div>
//         <button type="button" onClick={setRandomCard}>
//           New Card{" "}
//         </button>
//         <Card rank={card.rank} suit={card.suit} />
//       </div>
//     </AppContainer>
//   );
return (
  <AppContainer>
    <StyledText>Hello, World!</StyledText>
  </AppContainer>
);
 }

export default Play
