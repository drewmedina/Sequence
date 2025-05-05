import React, { useState } from "react";
import { Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styled from "styled-components";

const HelpIcon = styled(QuestionCircleOutlined)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  font-size: 42px;
  color: #f7fdad;
  cursor: pointer;
  z-index: 999;
  transition: transform 0.2s;
  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.4);

  &:hover {
    transform: scale(1.1);
  }
`;

const ModalBody = styled.div`
  font-family: 'Cinzel', serif;
  background-color: #fffbe6;
  padding: 16px;
  border-radius: 8px;
  color: #4e3b31;
  border: 1px solid #d8c3a5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  max-height: 70vh;
  overflow-y: auto;

  p {
    margin: 8px 0;
  }
`;

function HowToModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <HelpIcon onClick={() => setOpen(true)} />

      <Modal
        title={
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontWeight: "bold",
              fontSize: "20px",
              color: "#4e3b31",
              textAlign: "center",
            }}
          >
            How to Play
          </div>
        }
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <ModalBody>
  <p><strong>🎯 Goal:</strong> Be the first to create two sequences of five tokens in a row — vertically, horizontally, or diagonally.</p>

  <p><strong>🧩 Game Overview:</strong> The board is made up of playing cards (each appears twice). You’re dealt a hand of 7 cards, and on your turn, you play one to place a token on a matching space on the board.</p>

  <p><strong>🕹️ Turn Instructions:</strong> On your turn, select a card from your hand and click its matching card on the board to place your token. You'll automatically draw a new card after playing.</p>

  <p><strong>🃏 Wild Cards – Jacks:</strong> 
    <br />• Two-Eyed Jacks: Place a token anywhere on the board.
    <br />• One-Eyed Jacks: Remove an opponent’s token from the board.
  </p>

  <p><strong>🧱 Corner Cards:</strong> The four corners are wild. They are always occupied and count toward everyone’s sequences. You do not need a card to use them.</p>

  <p><strong>🏆 Winning the Game:</strong> A sequence is five tokens in a straight line. The first player or team to make two sequences wins. Sequences can overlap by one token.</p>

  <p><strong>🧠 Strategy Tips:</strong> 
    <br />• Block opponents from completing sequences. 
    <br />• Use one-eyed Jacks to disrupt them. 
    <br />• Save two-eyed Jacks for tight situations or to finish a sequence.
  </p>
</ModalBody>
      </Modal>
    </>
  );
}

export default HowToModal;
