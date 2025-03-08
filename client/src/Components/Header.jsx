import React, { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Space, Dropdown, Menu } from "antd";
import { useNavigate } from "react-router-dom";

function Header() {
  const { currentUser, logout } = useAuth();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Calls Firebase logout function
      navigate("/login"); // Redirect to login screen
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/profile")}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );


  console.log(currentUser);
  return (
    <header
      className="header"
      style={{
        backgroundColor: "#4e3b31",
        height: "6%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderBottom: "2px solid #000",
        padding: "2px",
      }}
    >
      <img
        src="../../Assets/logo.gif"
        style={{ height: "60%", padding: "4px" }}
      ></img>
      {currentUser ? (
        <div
          style={{
            padding: "10px",
            display: "flex",
            alignItems: "center",
            spacing: "5px",
            width: "9%",
            justifyContent: "space-between",
          }}
          onMouseEnter={() => setDropdownVisible(true)}
          onMouseLeave={() => setDropdownVisible(false)}
        >
          <p className="username">{currentUser.username}</p>
          <Dropdown overlay={menu} visible={dropdownVisible} placement="bottomRight">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: "#87d068",  cursor: "pointer" }}
            />
          </Dropdown>
        </div>
      ) : (
        <div></div>
      )}
    </header>
  );
}

export default Header;
