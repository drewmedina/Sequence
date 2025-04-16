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

function DefaultGameBoard({ boardData, setSelectedCard }) {
  const { currentUser } = useAuth();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 1fr)",
        columnGap: "3px",
        rowGap: "14px",
        transform: "scale(.6) rotate(90deg)",
        backgroundRepeat: "no-repeat",
        transformOrigin: "center",
      }}
    >
      {boardData.map((row, rowIndex) =>
        row.map((value, colIndex) => {
          const [cardValue, token] = value.split("#");
          const rank = cardValue.slice(0, -1); // Extract number/face (e.g., "10", "K")
          const suitSymbol = cardValue.slice(-1); // Extract suit symbol (♥, ♦, ♠, ♣)
          console.log(token);
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
                setSelectedCard({
                  row: rowIndex,
                  col: colIndex,
                  user: currentUser.username,
                });
              }}
            >
              <Card
                rank={formattedRank}
                suit={suitFolder}
                token={`#${token}` || null}
              ></Card>
            </HoverCard>
          );
        })
      )}
    </div>
  );
}

export default DefaultGameBoard;
