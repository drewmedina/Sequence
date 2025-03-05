import { getCard } from "../GamePieces/Deck"; 

const Hand = () => {
  // Generate 7 cards 
  const getCards = () => {
    return [getCard(), getCard(), getCard(), getCard(), getCard(), getCard(), getCard()];
  };

  return { getCards };
};

export default Hand;