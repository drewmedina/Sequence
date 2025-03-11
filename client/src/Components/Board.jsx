import React from 'react';
import Card from './GamePieces/Card';
function DefaultGameBoard (){
   const boardData = [
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
  ]
  
  return(
     <div style={{ 
      display: "grid", 
      gridTemplateColumns: "repeat(10, 1fr)", 
      gap: "3px", 
      transform: "scale(0.35) rotate(90deg)", 
      transformOrigin: "center",
    }}>
        {
    boardData.map((row) =>
    row.map((value) => {
      if (value === "F◯") {
        <div></div> // Keep "FREE" as text
      }
  
      const rank = value.slice(0, -1); // Extract number/face (e.g., "10", "K")
      const suitSymbol = value.slice(-1); // Extract suit symbol (♥, ♦, ♠, ♣)
  
      // Convert suit symbols to full suit names & folder structure
      const suitMap = {
        "♥": "hearts",
        "♦": "diamonds",
        "♠": "spades",
        "♣": "clubs",
        "X": "frees"
      };
      const suitFolder = suitMap[suitSymbol]; // Folder name (e.g., "Hearts")
  
      // Convert face card abbreviations to full names
      
      const rankMap = { 2: "Two", 3: "Three" ,4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten", "A": "Ace", "K": "King", "Q": "Queen", "F": "Free"};
      const formattedRank = rankMap[rank] || rank; // Use full name for face cards, else keep number
  
      // return {
      //   value,
      //   type: ["♠", "♣"].includes(suitSymbol) ? "black" : "red",
      //   image: `./images/Cards/${suitFolder}/${formattedRank}_of_${suitFolder.toLowerCase()}.png`, // Correct path
      //   token: null // Track player token (null = empty)
      // };
     return <Card rank={formattedRank} suit={suitFolder}></Card>
    })
)}
</div>

  );
  
}

export default DefaultGameBoard;
