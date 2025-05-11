import React, { useState } from "react";
import Card from "./GamePieces/Card";
import { useAuth } from "../Auth/AuthContext";

// Helper maps to convert between rank/suit codes and display values
const rankInverse = {
  Two: "2",
  Three: "3",
  Four: "4",
  Five: "5",
  Six: "6",
  Seven: "7",
  Eight: "8",
  Nine: "9",
  Ten: "10",
  Queen: "Q",
  King: "K",
  Ace: "A",
  Free: "FX",
};

const suitInverse = {
  hearts: "♥",
  diamonds: "♦",
  spades: "♠",
  clubs: "♣",
  frees: "X",
};

/**
 * HoverCard wraps children with hover and highlight effects.
 */
function HoverCard({ children, onClick, isHighlighted }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        transition: "transform 0.3s",
        transform: hover ? "translateY(-10px)" : "translateY(0)",
        boxShadow: isHighlighted
          ? "0 0 8px 4px rgba(245, 166, 35, 0.8)"
          : undefined,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * DefaultGameBoard renders the 10x10 grid of cards rotated and scaled,
 * allows selecting/highlighting cards based on hover and selection state.
 */
function DefaultGameBoard({
  boardData,
  setSelectedCard,
  hoveredCard,
  selectedHandCard,
}) {
  const { currentUser } = useAuth();

  // Build the codes for comparison (e.g., "Q♠", "10♦")
  const hoveredCode =
    hoveredCard &&
    (rankInverse[hoveredCard.rank] ?? "J") +
      (suitInverse[hoveredCard.suit] ?? "1");
  const selectedCode =
    selectedHandCard &&
    (rankInverse[selectedHandCard.rank] ?? "J") +
      (suitInverse[selectedHandCard.suit] ?? "1");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        columnGap: "3px",
        rowGap: "14px",
        transform: "scale(.60) rotate(90deg)", // rotate board for vertical orientation
        transformOrigin: "center",
      }}
    >
      {boardData.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          // value format: "RankSuit#token"
          const [cardValue, token] = value.split("#");
          const rank = cardValue.slice(0, -1);
          const suitSymbol = cardValue.slice(-1);

          const isHighlighted = hoveredCode === value || selectedCode === value;
          const isSelectable = selectedCode === value || selectedCode === "J1";

          // Map suit symbol back to folder name for Card component
          const suitMap = {
            "♥": "hearts",
            "♦": "diamonds",
            "♠": "spades",
            "♣": "clubs",
            X: "frees",
          };
          const suitFolder = suitMap[suitSymbol];

          // Convert numeric/text rank back to full rank string
          const rankMap = {
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
          const formattedRank = rankMap[rank] || rank;

          return (
            <HoverCard
              key={`${rowIndex}-${colIndex}`}
              isHighlighted={isHighlighted}
              onClick={() => {
                // Only allow click if card is currently selectable
                if (isSelectable) {
                  setSelectedCard({
                    row: rowIndex,
                    col: colIndex,
                    user: currentUser.username,
                    joker: selectedCode === "J1",
                  });
                }
              }}
            >
              <Card
                rank={formattedRank}
                suit={suitFolder}
                token={token || null}
                highlighted={isHighlighted}
              />
            </HoverCard>
          );
        })
      )}
    </div>
  );
}

export default DefaultGameBoard;
