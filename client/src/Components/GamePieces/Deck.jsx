const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"];

const deck = [];

suits.forEach(suit => {
  ranks.forEach(rank => {
    deck.push({ rank, suit });
  });
});

function getRandom(max) {
    return Math.floor(Math.random() * max);
  }

function getCard() {
    const randomIndex = getRandom(deck.length);
    return deck[randomIndex];
  }

  export { getCard };

