// UserWaitingComponent.jsx
import React from "react";
import Avatar from "antd/es/avatar/Avatar";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../Auth/AuthContext";
import "./../Styling/UserWaitingComponent.css";

/**
 * Displays a player's placeholder hand while waiting for their turn.
 * Highlights the wrapper if it's currently their turn.
 */
function UserWaitingComponent({ user, isCurrentTurn }) {
  const { currentUser } = useAuth();
  const isYou = currentUser?.email === user.email;

  return (
    <div
      className={
        `user-waiting-wrapper ` + (isCurrentTurn ? "current" : "not-current")
      }
    >
      <div className="user-waiting-container">
        <div className="name-row">
          {/* Show user's avatar or default icon */}
          <Avatar src={user.avatar} icon={!user.avatar && <UserOutlined />} />
          <span>
            {user.username} {isYou && "(you)"}
          </span>
        </div>

        <div className="card-back-container">
          {/* Render 7 face-down cards as a waiting hand */}
          {[...Array(7)].map((_, idx) => (
            <div key={idx} className="card-back">
              🂠
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserWaitingComponent;
