import React, { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";


function Header() {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();


  const handleLogout = async () => {
    try {
      await logout();
      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: handleLogout,
    },
  ];


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
      {/* <img
        src="../../Assets/logo.gif"
        style={{ height: "0%", padding: "4px" }}
      ></img> */}
      <h1 style={{
        color: "#f7fdad",
        fontSize: "40px",
        fontWeight: "bold",
        paddingLeft: "10px",
        fontFamily: "'Cinzel', serif",
      }}>
        Sequence
      </h1>
      {currentUser ? (
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            padding: "10px",
            fontSize: "25px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "auto",
            justifyContent: "space-between",
          }}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <p className="username">{currentUser.username}</p>
          <Dropdown
            menu={{ items: menuItems }}
            open={dropdownOpen}
            placement="bottomRight"
          >
           <Avatar
            size="small"
            src={currentUser?.avatar || undefined}
            icon={!currentUser?.avatar && <UserOutlined />}
            style={{ cursor: "pointer" }}
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
