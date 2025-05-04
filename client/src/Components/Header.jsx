import React, { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import styled from "styled-components";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import { useEffect } from "react";




const LeaderboardContent = styled.div`
  font-family: 'Cinzel', serif;
  background-color: #fffbe6;
  color: #4e3b31;
  font-size: 16px;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #d8c3a5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    margin: 4px 0;
    border-radius: 4px;
  }

  .row:nth-child(even) {
    background-color: rgba(212, 175, 55, 0.05); /* subtle alt row */
  }

  .rank {
    font-weight: bold;
    width: 25px;
  }

  .name {
    flex: 1;
    padding-left: 8px;
  }

  .wins {
    text-align: right;
    font-weight: 500;
    min-width: 80px;
  }

  .first-place {
    color: #d4af37;
    font-weight: bold;
    font-size: 18px;
  }
`;

function Header() {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLeaderboardVisible) {
      const fetchLeaderboard = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "users"));
          const users = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.wins !== undefined) {
              users.push({ username: data.username || "Unknown", wins: data.wins });
            }
          });
  
          // Sort by wins descending and take top 3
          const top3 = users.sort((a, b) => b.wins - a.wins).slice(0, 5);
          setLeaderboardData(top3);
        } catch (error) {
          console.error("Failed to fetch leaderboard:", error);
        }
      };
  
      fetchLeaderboard();
    }
  }, [isLeaderboardVisible]);
  

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
      key: "leaderboard",
      label: "Leaderboard",
      onClick: () => setIsLeaderboardVisible(true),
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
          {/* <MenuOutlined
            style={{ fontSize: 22, color: "#f7fdad", cursor: "pointer" }}
            onClick={() => console.log("Hamburger menu clicked")}
          /> */}

        </div>
      ) : (
        <div></div>
      )}
    
      <Modal
        title={<span style={{ fontFamily: "'Cinzel', serif", color: "#4e3b31", fontWeight: "bold", fontSize: "20px"}}>Leaderboard</span>}
        open={isLeaderboardVisible}
        onCancel={() => setIsLeaderboardVisible(false)}
        footer={null}
      >
        <LeaderboardContent>
          {leaderboardData.map((user, index) => (
      <div
      className={`row ${index === 0 ? "first-place" : ""}`}
      key={user.username}
    >
      <span className="rank">{index + 1}.</span>
      <span className="name">{user.username}</span>
      <span className="wins">
        {index === 0 ? "🏆 " : ""}
        {user.wins} wins
      </span>
    </div>
  ))}
</LeaderboardContent>

      </Modal>

      
    </header>
  );
}

export default Header;
