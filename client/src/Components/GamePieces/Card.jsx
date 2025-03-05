import React, { useState } from "react";
import styled from "styled-components";

 const CardBox = styled.div`
     font-size: 8rem;
     line-height: 1;
     padding: 0;
     margin: 0; 
     color: ${({ suit }) => (suit === "hearts" || suit === "diamonds" ? "red" : "black")};
     //background-color: rgba(255, 255, 255, 0.6);
     //margin-left: -30px;

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
    Two: "🂲", Three: "🂳", Four: "🂴", Five: "🂵", Six: "🂶", Seven: "🂷", Eight: "🂸", Nine: "🂹", Ten: "🂺",
    Queen: "🂽", King: "🂾", Ace: "🂱"
  },
  diamonds: {
    Two: "🃂", Three: "🃃", Four: "🃄", Five: "🃅", Six: "🃆", Seven: "🃇", Eight: "🃈", Nine: "🃉", Ten: "🃊",
    Queen: "🃍", King: "🃎", Ace: "🃁"
  },
  clubs: {
    Two: "🃒", Three: "🃓", Four: "🃔", Five: "🃕", Six: "🃖", Seven: "🃗", Eight: "🃘", Nine: "🃙", Ten: "🃚",
    Queen: "🃝", King: "🃞", Ace: "🃑", BJoker1: "🃏︎", BJoker2: "🃏︎", WJoker1: "🃟", Wjoker2:"🃟"
  },
  spades: {
    Two: "🂢", Three: "🂣", Four: "🂤", Five: "🂥", Six: "🂦", Seven: "🂧", Eight: "🂨", Nine: "🂩", Ten: "🂪",
    Queen: "🂭", King: "🂮", Ace: "🂡", BJoker1: "🃏︎", BJoker2: "🃏︎", WJoker1: "🃟", Wjoker2:"🃟"
  },
  jokers: {
    BJoker1: "🃏︎", BJoker2: "🃏︎", WJoker1: "🃟", Wjoker2:"🃟"
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