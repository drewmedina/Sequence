import React, { useState } from "react";
import styled from "styled-components";

const CardBox = styled.div`
  font-size: 8rem;
  line-height: 0.42;
  padding: 20px;
  margin: 0;
  color: ${({ suit }) =>
    suit === "hearts" || suit === "diamonds" || suit === "redJokers"
      ? "red"
      : "black"};
  background-color: white;
  width: 90px;
  height: 120px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding-top: 20px;
`;

//add token
//gamebaord matrix .map function
//get consistently 7 to show up
//discard deck visual and draw deck visual
//make board show up
//place a token function
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
    Queen: "🃝",
    King: "🃞",
    Ace: "🃑",
    BJoker1: "🃏︎",
    BJoker2: "🃏︎",
    WJoker1: "🃟",
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
    Free: "🂠", // we can also do 🂠⠀
  },
};

function Card({ rank, suit, token = null }) {
  if (!token) {
    return <CardBox suit={suit}>{cardSymbols[suit][rank]}</CardBox>;
  } else {
    return (
      <CardBox suit={suit}>
        {cardSymbols[suit][rank]}
        <div
          style={{
            position: "absolute",
            backgroundColor: token,
            borderRadius: "50%",
            height: "5%",
            aspectRatio: "1",
            zIndex: "2",
          }}
        ></div>
      </CardBox>
    );
  }
}

export default Card;
