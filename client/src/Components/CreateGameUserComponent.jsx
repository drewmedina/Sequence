import React from "react";
import Avatar from "antd/es/avatar/Avatar";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../Auth/AuthContext";
import "./../Styling/CreateGameUserComponent.css";

/**
 * Displays a user card within the game lobby.
 * Highlights if it's the current user's turn and indicates "you" for the logged-in player.
 */
function CreateGameUserComponent({ user, isCurrentTurn }) {
  const { currentUser } = useAuth();
  // Determine if this card represents the logged-in user
  const isYou = currentUser?.email === user.email;

  // Build CSS class string: always include 'user-card', add 'current-turn' if applicable
  const cardClasses = ["user-card", isCurrentTurn ? "current-turn" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses}>
      <div className="user-card-header">
        {/* Show avatar or fallback icon */}
        <Avatar src={user.avatar} icon={!user.avatar && <UserOutlined />} />
        <span>
          {user.username} {isYou && "(you)"}
        </span>
      </div>
    </div>
  );
}

export default CreateGameUserComponent;
