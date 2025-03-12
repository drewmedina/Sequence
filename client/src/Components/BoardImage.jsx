import React from "react";
import boardImage from "../assets/brownboard.png"; 

const BoardImage = () => {
  return (
    <img 
      src={boardImage} 
      alt="Sequence Board"
      style={{
        width: "610px",
        height: "750px",
        objectFit: "contain"
      }}
    />
  );
};


export default BoardImage;
