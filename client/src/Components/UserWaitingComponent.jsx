import React from "react";
import Avatar from "antd/es/avatar/Avatar";
import { useAuth } from "../Auth/AuthContext";
function UserWaitingComponent({ user }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        justifyContent: "flex-start",
        backgroundColor: "#4e3b31",
        alignItems: "center",
        width: "100%",
        borderRadius: "4px",
        paddingLeft: "5px",
      }}
    >
      <Avatar />
      {<p>{user.username}</p>}
    </div>
  );
}

export default UserWaitingComponent;
