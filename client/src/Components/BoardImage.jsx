import React from "react";
import boardImage from "../assets/sequenceboard.png"; 

const BoardImage = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${boardImage})`,
        backgroundSize: "contain",
        width: "610px",
        height: "750px",
        backgroundRepeat: "no-repeat",
      }}
    >
    </div>
  );
};

export default BoardImage;
