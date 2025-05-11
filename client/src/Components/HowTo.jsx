// HowToModal.jsx
import React, { useState } from "react";
import { Modal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./../Styling/HowToModal.css";

function HowTo() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  return (
    <>
      {/* Help icon toggles the "How to Play" modal */}
      <QuestionCircleOutlined
        className={`help-icon${hover ? " hover" : ""}`}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      />

      <Modal
        title={<div className="modal-title">How to Play</div>}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        {/* Modal body contains step-by-step game instructions */}
        <div className="modal-body">
          <p>
            <strong>🎯 Goal:</strong> Be the first to create two sequences of
            five tokens in a row — vertically, horizontally, or diagonally.
          </p>

          <p>
            <strong>🧩 Game Overview:</strong> The board is made up of playing
            cards (each appears twice). You’re dealt a hand of 7 cards, and on
            your turn, you play one to place a token on a matching space on the
            board.
          </p>

          <p>
            <strong>🕹️ Turn Instructions:</strong> On your turn, select a card
            from your hand and click its matching card on the board to place
            your token. You'll automatically draw a new card after playing.
          </p>

          <p>
            <strong>🃏 Wild Cards – Jacks:</strong>
            <br />
            • Two-Eyed Jacks: Place a token anywhere on the board.
            <br />• One-Eyed Jacks: Remove an opponent’s token from the board.
          </p>

          <p>
            <strong>🧱 Corner Cards:</strong> The four corners are wild. They
            are always occupied and count toward everyone’s sequences. You do
            not need a card to use them.
          </p>

          <p>
            <strong>🏆 Winning the Game:</strong> A sequence is five tokens in a
            straight line. The first player or team to make two sequences wins.
            Sequences can overlap by one token.
          </p>

          <p>
            <strong>🧠 Strategy Tips:</strong>
            <br />
            • Block opponents from completing sequences.
            <br />
            • Use one-eyed Jacks to disrupt them.
            <br />• Save two-eyed Jacks for tight situations or to finish a
            sequence.
          </p>
        </div>
      </Modal>
    </>
  );
}

export default HowTo;
