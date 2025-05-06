import React from "react";
import Card from "./GamePieces/Card";
import styled from "styled-components";
import { useAuth } from "../Auth/AuthContext";

const HoverCard = styled.div`
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-10px); /* Makes the card lift slightly on hover */
  }
`;

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

function DefaultGameBoard({
  boardData,
  setSelectedCard,
  hoveredCard,
  selectedHandCard,
}) {
  const { currentUser } = useAuth();
  const hoveredCode =
    hoveredCard &&
    (rankInverse[hoveredCard.rank] ?? "J") + (suitInverse[hoveredCard.suit] ?? "1");
  const selectedCode =
    selectedHandCard &&
    (rankInverse[selectedHandCard.rank] ?? "J") +
      (suitInverse[selectedHandCard.suit] ?? "1");
  console.log(selectedCode);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        columnGap: "3px",
        rowGap: "14px",
        transform: "scale(.60) rotate(90deg)",
        backgroundRepeat: "no-repeat",
        transformOrigin: "center",
      }}
    >
      {boardData.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const [cardValue, token] = value.split("#");
          const rank = cardValue.slice(0, -1); // Extract number/face (e.g., "10", "K")
          const suitSymbol = cardValue.slice(-1); // Extract suit symbol (♥, ♦, ♠, ♣)
          const isHighlighted = hoveredCode === value;
          const isSelectable = selectedCode === value || selectedCode == "J1";
          const parts = value.split("#");
          const tokenPath = parts.length > 1 ? parts[1] : null;
          // Convert suit symbols to full suit names & folder structure
          const suitMap = {
            "♥": "hearts",
            "♦": "diamonds",
            "♠": "spades",
            "♣": "clubs",
            X: "frees",
          };
          const suitFolder = suitMap[suitSymbol]; // Folder name (e.g., "Hearts")

          // Convert face card abbreviations to full names

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
              key={rowIndex - colIndex}
              onClick={() => {
                if (isSelectable) {
                  setSelectedCard({
                    row: rowIndex,
                    col: colIndex,
                    user: currentUser.username,
                    joker: selectedCode === "J1",
                  });
                }
              }}
              style={
                isHighlighted
                  ? {
                      boxShadow: "0 0 8px 4px rgba(245, 166, 35, 0.8)",
                    }
                  : {}
              }
            >
              <Card
                rank={formattedRank}
                suit={suitFolder}
                token={tokenPath}
                highlighted={isHighlighted}
              ></Card>
            </HoverCard>
          );
        })
      )}
    </div>
  );
}

export default DefaultGameBoard;
