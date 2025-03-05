import React, { useState } from "react";
import styled from "styled-components";

 const CardBox = styled.div`
     font-size: 8rem;
     line-height: 1;
     padding: 0;
     margin: 0; 
     display: flex;
     justify-content:center;
     align-items:center;
     color: ${({ suit }) => (suit === "hearts" || suit === "diamonds" ? "red" : "black")};
     //background-color: rgba(255, 255, 255, 0.6);
     //margin-left: -30px;

 `;
//add token 
//gamebaord matrix .map function
//get consistently 7 to show up
//discard deck visual and draw deck visual
//make board show up
//place a token function
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
    BJoker1: "🃟", BJoker2: "🃟", WJoker1: "🃟", Wjoker2:"🃟"
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