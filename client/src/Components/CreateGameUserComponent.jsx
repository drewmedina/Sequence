// CreateGameUserComponent.jsx
import React from "react";
import Avatar from "antd/es/avatar/Avatar";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useAuth } from "../Auth/AuthContext";

// outer box around each player
const Wrapper = styled.div`
  width: 140px; /* fixed width prevents squish */
  padding: 10px;
  margin: 5px;
  border-radius: 8px;
  background-color: ${({ isActive }) => (isActive ? "#ffdf91" : "#f0f0f0")};
  border: ${({ isActive }) =>
    isActive ? "2px solid #f5a623" : "1px solid #ccc"};
  box-shadow: ${({ isActive }) =>
    isActive ? "0 0 10px rgba(245,166,35,0.6)" : "none"};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
`;

// row with avatar + name
const NameRow = styled.div`
  width: 100%;
  background-color: #4e3b31;
  color: white;
  padding: 6px 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: bold;
  margin-bottom: 8px;
`;
function CreateGameUserComponent({ user, isCurrentTurn }) {
  const { currentUser } = useAuth();
  const isYou = currentUser?.email === user.email;
  return (
    <Wrapper isActive={isCurrentTurn}>
      <NameRow>
        <Avatar
          src={user.avatar} /* use src for image URLs */
          icon={!user.avatar && <UserOutlined />}
        />
        <span>
          {user.username} {isYou && "(you)"}
        </span>
      </NameRow>
    </Wrapper>
  );
}

export default CreateGameUserComponent;
