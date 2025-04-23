import React from "react";
import Avatar from "antd/es/avatar/Avatar";
//import { useAuth } from "../Auth/AuthContext";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

const StyledCardBack = styled.div`

    color: black;
  font-size: 4rem;               /* Adjusted emoji size */
  line-height: 1.0;                  /* Keeps emoji vertically balanced */
  color: black;
  background-color: white;
  width: 45px;                     /* Card width */
  height: 60px;                    /* Card height */
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;             /* Centers emoji vertically! */
  box-sizing: border-box;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding-bottom: 13px;
  margin: -8px;  
`;


function UserWaitingComponent({ user }) {
  return (
     <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px", // space between avatar and cards
        width: "fit-content",
      }}
     >
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        justifyContent: "flex-start",
        backgroundColor: "#4e3b31",
        alignItems: "center",
        width: "70%",
        borderRadius: "4px",
        paddingLeft: "5px",
      }}
    >
      <Avatar 
      icon={<UserOutlined />}
      style={{ backgroundColor: "#87d068", cursor: "pointer" }}
      />
      {<p>{user.username}</p>}
    </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {[...Array(7)].map((_, index) => (
          <StyledCardBack key={index}>🂠</StyledCardBack>
        ))}
      </div>

    </div>
    
    
  );
}

function CardBack() {
  return <StyledCardBack>🂠</StyledCardBack>;
}

function CardBackHand() {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      {[...Array(7)].map((_, index) => (
        <CardBack key={index} />
      ))}
    </div>
  );
}

export default UserWaitingComponent;
