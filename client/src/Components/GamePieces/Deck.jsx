const suits = ["hearts", "diamonds", "clubs", "spades"];
const ranks = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"];

const deck = [];

suits.forEach(suit => {
  ranks.forEach(rank => {
    deck.push({ rank, suit });
  });
});

//need way of manually adding jokes
// deck.push({ jokers, BJoker1 });
// deck.push({ jokers, BJoker2 });
// deck.push({ "jokers", "WJoker1" });
// deck.push({ jokers, WJoker2 });

deck.push({ rank: "BJoker1", suit: "jokers" });
deck.push({ rank: "BJoker2", suit: "jokers" });


function getRandom(max) {
    return Math.floor(Math.random() * max);
  }

function getCard() {
    const randomIndex = getRandom(deck.length);
    return deck[randomIndex];
  }

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

