import React from "react";
import "./../../Styling/Card.css";

// Mapping from suit and rank to the corresponding card symbol
const cardSymbols = {
  hearts: {
    Two: "🂲",
    Three: "🂳",
    Four: "🂴",
    Five: "🂵",
    Six: "🂶",
    Seven: "🂷",
    Eight: "🂸",
    Nine: "🂹",
    Ten: "🂺",
    Jack: "🂻",
    Queen: "🂽",
    King: "🂾",
    Ace: "🂱",
  },
  diamonds: {
    Two: "🃂",
    Three: "🃃",
    Four: "🃄",
    Five: "🃅",
    Six: "🃆",
    Seven: "🃇",
    Eight: "🃈",
    Nine: "🃉",
    Ten: "🃊",
    Jack: "🃋",
    Queen: "🃍",
    King: "🃎",
    Ace: "🃁",
  },
  clubs: {
    Two: "🃒",
    Three: "🃓",
    Four: "🃔",
    Five: "🃕",
    Six: "🃖",
    Seven: "🃗",
    Eight: "🃘",
    Nine: "🃙",
    Ten: "🃚",
    Jack: "🃛",
    Queen: "🃝",
    King: "🃞",
    Ace: "🃑",
    Wjoker1: "🃟",
    Wjoker2: "🃟",
  },
  spades: {
    Two: "🂢",
    Three: "🂣",
    Four: "🂤",
    Five: "🂥",
    Six: "🂦",
    Seven: "🂧",
    Eight: "🂨",
    Nine: "🂩",
    Ten: "🂪",
    Jack: "🂫",
    Queen: "🂭",
    King: "🂮",
    Ace: "🂡",
  },
  blackJokers: {
    BJoker1: "🃟",
    BJoker2: "🃟",
    BJoker3: "🃟",
    BJoker4: "🃟",
  },
  redJokers: {
    RJoker1: "🃟",
    RJoker2: "🃟",
    RJoker3: "🃟",
    RJoker4: "🃟",
  },
  frees: {
    Free: "🂠",
  },
};

/**
 * Card component
 * Renders a playing card symbol, optional token overlay, and highlighting.
 */
function Card({ rank, suit, token = null, highlighted }) {
  // Determine if the card suit should be styled red
  const isRed =
    suit === "hearts" || suit === "diamonds" || suit === "redJokers";

  const classNames = [
    "card-container",
    isRed ? "red" : "",
    highlighted ? "highlighted" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames}>
      {cardSymbols[suit][rank]}
      {token && <img src={token} alt="token" className="token-img" />}
    </div>
  );
}

export default Card;
