import React from "react";
import boardImage from "../assets/brownboard.png";

const BoardImage = () => {
  return (
    <img
      src={boardImage}
      alt="Sequence Board"
      style={{
        width: "100%",
        height: "100%",
        //
        objectFit: "contain",
      }}
    />
  );
};

export default BoardImage;
