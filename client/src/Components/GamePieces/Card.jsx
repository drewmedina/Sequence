import React, { useState } from "react";
import styled from "styled-components";

 const CardBox = styled.div`

     font-size: 8rem;
     color: ${({ suit }) => (suit === "hearts" || suit === "diamonds" ? "red" : "black")};

 `;
//add token 
//get 7 to show up in a row
//deck and discard 
//gamebaord matrix .map function
//1. in pages make a game page 
//2. app.jsx make a [path to play game]
//3. 
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
      //Jack: "🂻",a
      Queen: "🂽",
      King: "🂾",
      Ace: "🂱"
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
      //Jack: "🃁",
      Queen: "🃍",
      King: "🃎",
      Ace: "🃁"
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
      //Jack: "🃁",
      Queen: "🃝",
      King: "🃞",
      Ace: "🃑"
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
      //Jack: "🃁",
      Queen: "🂭",
      King: "🂮",
      Ace: "🂡"
    }
  };

  function Card({ rank, suit }) {
    return (
      <CardBox suit={suit}>
        {cardSymbols[suit][rank]}
      </CardBox>
    );
  }

  export default Card;