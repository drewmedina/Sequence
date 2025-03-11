import { getCard } from "../GamePieces/Deck";
import { useState } from "react"; 
//generates and stores 
// const Hand = () => {
//   // Generate 7 cards 
// //   const [cards, setCards] = useState([
// //     getCard(), getCard(), getCard(), getCard(), getCard(), getCard(), getCard()
// //   ]);
//   const getCards = () => {
//     return [getCard(), getCard(), getCard(), getCard(), getCard(), getCard(), getCard()];
//   };

// //   const [discardPile, setDiscardPile] = useState([]);
// //   const discardCard = (index) => {
// //     setDiscardPile((prevPile) => [...prevPile, cards[index]]); // Add to discard
// //     setCards((prevHand) => prevHand.filter((_, i) => i !== index)); // Remove from hand
// //   };

// //   const setNewCards = () => {
// //     setCards([
// //       getCard(), getCard(), getCard(), getCard(), getCard(), getCard(), getCard()
// //     ]);
// //   };


//   return { getCards };
// };

const Hand = () => {
  // state to manage the 7 cards in the hand
  const [cards, setCards] = useState(() => {
    return [getCard(), getCard(), getCard(), getCard(), getCard(), getCard(), getCard()];
  });

  //  get the current cards (we use this in play.jsx)
  const getCards = () => cards;

  //  set 7 new cards
  const setNewCards = () => {
    setCards([getCard(), getCard(), getCard(), getCard(), getCard(), getCard(), getCard()]);
  };

  return { getCards, setNewCards };
};

export default Hand;
