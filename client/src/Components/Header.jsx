// Header.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../Auth/AuthContext";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Modal } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import ProfileContent from "./ProfileContent";
import "../Styling/Header.css";

/**
 * Header component for the Sequence app.
 * Displays the app title, current user info, and handles profile/leaderboard modals.
 */
export default function Header() {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  // Fetch top 5 users sorted by wins whenever the leaderboard modal is opened
  useEffect(() => {
    if (!isLeaderboardVisible) return;
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            username: data.username || "Unknown",
            wins: data.wins ?? 0,
          };
        });
        setLeaderboardData(users.sort((a, b) => b.wins - a.wins).slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    })();
  }, [isLeaderboardVisible]);

  // Sign the user out
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Configuration for the user dropdown menu
  const menuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => {
        setIsProfileVisible(true);
        setDropdownOpen(false);
      },
    },
    {
      key: "leaderboard",
      label: "Leaderboard",
      onClick: () => {
        setIsLeaderboardVisible(true);
        setDropdownOpen(false);
      },
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        handleLogout();
        setDropdownOpen(false);
      },
    },
  ];

  return (
    <header className="header">
      <h1 className="header-title">Sequence</h1>

      {currentUser && (
        <div className="user-section">
          <span>{currentUser.username}</span>
          {/* Avatar that toggles the dropdown menu */}
          <Dropdown
            trigger={["click"]}
            menu={{ items: menuItems }}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            placement="bottomRight"
          >
            <Avatar
              size="small"
              src={currentUser.avatar || undefined}
              icon={!currentUser.avatar && <UserOutlined />}
              className="avatar-clickable"
            />
          </Dropdown>
        </div>
      )}
      <Modal
        title={<span className="modal-title">Leaderboard</span>}
        open={isLeaderboardVisible}
        onCancel={() => setIsLeaderboardVisible(false)}
        footer={null}
      >
        <div className="leaderboard-content">
          {leaderboardData.map((user, idx) => (
            <div
              key={user.id}
              className={`leaderboard-row
                 ${idx % 2 === 1 ? "even" : ""}
                 ${idx === 0 ? "first-place" : ""}`}
            >
              <span className="leaderboard-rank">{idx + 1}.</span>
              <span className="leaderboard-name">{user.username}</span>
              <span className="leaderboard-wins">{user.wins} wins</span>
            </div>
          ))}
        </div>
      </Modal>
      <Modal
        title={<span className="modal-title">Profile</span>}
        open={isProfileVisible}
        onCancel={() => setIsProfileVisible(false)}
        footer={null}
        width={500}
      >
        <div className="profile-content-wrapper">
          <ProfileContent onClose={() => setIsProfileVisible(false)} />
        </div>
      </Modal>
    </header>
  );
}
