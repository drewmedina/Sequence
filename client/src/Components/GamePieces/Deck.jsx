const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Queen", "King", "Ace"];

const deck = [];

suits.forEach(suit => {
  ranks.forEach(rank => {
    deck.push({ rank, suit });
  });
});


deck.push({ rank: "BJoker1", suit: "blackJokers" });
deck.push({ rank: "BJoker2", suit: "blackJokers" });
deck.push({ rank: "BJoker3", suit: "blackJokers" });
deck.push({ rank: "BJoker4", suit: "blackJokers" });
deck.push({ rank: "RJoker1", suit: "redJokers" });
deck.push({ rank: "RJoker2", suit: "redJokers" });
deck.push({ rank: "RJoker3", suit: "redJokers" });
deck.push({ rank: "RJoker4", suit: "redJokers" });




function getRandom(max) {
    return Math.floor(Math.random() * max);
  }

function getCard() {
    const randomIndex = getRandom(deck.length);
    console.log("Card drawn:", deck[randomIndex]);
    return deck[randomIndex];
xs  }

  function removeCardFromDeck(card) {
    const index = deck.findIndex(c => c.rank === card.rank && c.suit === card.suit);
    if (index !== -1) {
      deck.splice(index, 1); // Removes the card from the deck
    }
  }

  function drawCard() {
    const card = getCard(); // Get a random card from the deck
    removeCardFromDeck(card); // Remove it from the deck
    return card; // Return the card to be added to hand
  }

  export { getCard, removeCardFromDeck, drawCard};

