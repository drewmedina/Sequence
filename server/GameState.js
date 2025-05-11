export class GameState {
  // Maps card suit symbols to internal folder names
  suitMap = {
    "♥": "hearts",
    "♦": "diamonds",
    "♠": "spades",
    "♣": "clubs",
    X: "frees",
  };

  // Maps card rank identifiers to full rank names
  rankMap = {
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    A: "Ace",
    K: "King",
    Q: "Queen",
    F: "Free",
  };

  constructor(players) {
    this.players = players;
    // Initial board setup: FX denotes free corners
    this.board = [
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
    this.discardPile = [];
    this.deck = this.initializeDeck(); // Build and shuffle full deck
    this.hands = {
      [players[0].email]: [
        { rank: "Two", suit: "clubs" },
        { rank: "Four", suit: "clubs" },
        { rank: "BJoker1", suit: "blackJokers" },
        { rank: "RJoker1", suit: "redJokers" },
        { rank: "Three", suit: "clubs" },
        { rank: "Six", suit: "clubs" },
        { rank: "Five", suit: "clubs" },
      ],
    };
    this.currentTurnIndex = 0;
    this.gameStarted = false;
    this.colors = [
      "#../../../Assets/redToken.png",
      "#../../../Assets/blueToken.png",
      "#../../../Assets/greenToken.png",
    ];
    this.winner = null;
  }

  // Create a shuffled deck including jokers
  initializeDeck() {
    const suits = ["spades", "hearts", "diamonds", "clubs"];
    const ranks = [
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Queen",
      "King",
      "Ace",
    ];
    let deck = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ rank, suit });
        deck.push({ rank, suit }); // two of each card
      }
    }
    // Add jokers
    deck.push({ rank: "BJoker1", suit: "blackJokers" });
    deck.push({ rank: "BJoker2", suit: "blackJokers" });
    deck.push({ rank: "BJoker3", suit: "blackJokers" });
    deck.push({ rank: "BJoker4", suit: "blackJokers" });
    deck.push({ rank: "RJoker1", suit: "redJokers" });
    deck.push({ rank: "RJoker2", suit: "redJokers" });
    deck.push({ rank: "RJoker3", suit: "redJokers" });
    deck.push({ rank: "RJoker4", suit: "redJokers" });
    return this.shuffle(deck);
  }

  // Fisher–Yates shuffle implementation
  shuffle(array) {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  // Deal 7 cards to a player's hand
  dealHand(player) {
    this.hands[player.email] = [];
    for (let i = 0; i < 7; i++) {
      this.hands[player.email].push(this.deck.pop());
    }
  }

  getCurrentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  // Core logic for playing a card (including wild jacks)
  playCard(player, row, col, joker) {
    let hand = this.hands[player.email];
    // Handle two-eyed jack (place token)
    const blackIdx = hand.findIndex(
      (c) => c.suit === "blackJokers" && c.rank.startsWith("BJoker")
    );
    if (blackIdx !== -1 && joker) {
      // ... remove token logic ...
      const square = this.board[row][col];
      const [cardCode, marker] = square.split("#");
      if (!marker) {
        throw new Error("No token to remove");
      }
      this.board[row][col] = cardCode;
      this.discardPile.push(hand.splice(blackIdx, 1)[0]);
      this.drawCard(player);
      this.advanceTurn();
      return;
    }

    // Handle one-eyed jack (remove opponent token)
    const redIdx = hand.findIndex(
      (c) => c.suit === "redJokers" && c.rank.startsWith("RJoker")
    );
    if (redIdx !== -1 && joker) {
      // ... place token logic ...
      const square = this.board[row][col];
      if (square.includes("#")) {
        throw new Error("Square already occupied");
      }
      const colorTag = this.colors[this.currentTurnIndex];
      this.board[row][col] = square + colorTag;
      this.discardPile.push(hand.splice(redIdx, 1)[0]);
      const winnerColor = this.checkForWin();
      if (winnerColor) {
        this.winner = this.players[this.colors.indexOf(winnerColor)];
      } else {
        this.drawCard(player);
        this.advanceTurn();
      }
      return;
    }

    // Regular card play
    const [rawRank, rawSuit] = this.board[row][col]
      .split("#")[0]
      .match(/^([A-Z0-9]+)([♠♥♦♣])$/)
      .slice(1);
    const card = {
      rank: this.rankMap[rawRank],
      suit: this.suitMap[rawSuit],
    };

    if (
      player.username !== this.getCurrentPlayer().username ||
      player.email != this.getCurrentPlayer().email
    ) {
      throw new Error("Not this player's turn");
    }

    const index = hand.findIndex(
      (c) => c.rank === card.rank && c.suit === card.suit
    );
    if (index === -1) throw new Error("Card not in hand");

    this.board[row][col] += this.colors[this.currentTurnIndex];
    this.discardPile.push(card);
    this.hands[player.email].splice(index, 1);

    const winnerColor = this.checkForWin();
    if (winnerColor) {
      this.winner = this.players[this.colors.indexOf(winnerColor)];
    } else {
      this.drawCard(player);
      this.advanceTurn();
    }
  }

  // Draw a card from deck into player's hand
  drawCard(player) {
    if (this.deck.length === 0) return null;
    const card = this.deck.pop();
    this.hands[player.email].push(card);
    return card;
  }

  // Rotate turn to next player
  advanceTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
  }

  addPlayer(player) {
    if (this.players.length < 3) {
      this.players.push(player);
      this.dealHand(player);
    } else {
      throw new Error("Lobby Full");
    }
  }

  getPlayers() {
    return this.players;
  }

  // Check for any sequence of five matching tokens on the board
  checkForWin() {
    const directions = [
      [0, 1], // horizontal →
      [1, 0], // vertical ↓
      [1, 1], // diagonal ↘
      [1, -1], // diagonal ↙
    ];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const squareParts = this.board[i][j].split("#");
        const marker = squareParts[squareParts.length - 1];
        if (marker.length < 1) continue;

        for (const [dx, dy] of directions) {
          let count = 1;

          for (let k = 1; k < 5; k++) {
            const ni = i + k * dx;
            const nj = j + k * dy;
            if (
              ni >= 0 &&
              nj >= 0 &&
              ni < this.board.length &&
              nj < this.board[0].length &&
              this.board[ni][nj].endsWith(`#${marker}`)
            ) {
              count++;
            } else {
              break;
            }
          }

          if (count >= 5) return `#${marker}`;
        }
      }
    }

    return null;
  }
}
