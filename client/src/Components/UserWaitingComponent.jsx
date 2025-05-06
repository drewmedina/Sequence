import React from "react";
import Avatar from "antd/es/avatar/Avatar";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useAuth } from "../Auth/AuthContext";
const YouLabel = styled.span`
  font-size: 0.75em;
  opacity: 0.8;
`;
const StyledCardBack = styled.div`
  color: black;
  font-size: 4rem; /* Adjusted emoji size */
  line-height: 1; /* Keeps emoji vertically balanced */
  color: black;
  background-color: white;
  width: 45px; /* Card width */
  height: 60px; /* Card height */
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center; /* Centers emoji vertically! */
  box-sizing: border-box;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding-bottom: 13px;
  margin: -8px;
`;
const Wrapper = styled.div`
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  background-color: ${({ isActive }) => (isActive ? "#ffdf91" : "#eee")};
  border: ${({ isActive }) =>
    isActive ? "2px solid #f5a623" : "1px solid #ccc"};
  box-shadow: ${({ isActive }) =>
    isActive ? "0 0 10px rgba(245, 166, 35, 0.6)" : "none"};
  transition: all 0.3s ease;
`;
function UserWaitingComponent({ user, isCurrentTurn }) {
  const { currentUser } = useAuth();
  const isYou = currentUser?.email === user.email;
  return (
    <Wrapper isActive={isCurrentTurn}>
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
            src={user.avatar} /* use src for image URLs */
            icon={!user.avatar && <UserOutlined />}
          />
          {
            <span>
              {user.username} {isYou && "(you)"}
            </span>
          }
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          {[...Array(7)].map((_, index) => (
            <StyledCardBack key={index}>🂠</StyledCardBack>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

function CardBack() {
  return <StyledCardBack>🂠</StyledCardBack>;
}

function CardBackHand() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
    >
      {[...Array(7)].map((_, index) => (
        <CardBack key={index} />
      ))}
    </div>
  );
}

export default UserWaitingComponent;
