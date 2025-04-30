// ProfilePage.jsx
import React, { useState } from "react";
import { Card, Form, Input, Button, Upload, Avatar, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../Auth/AuthContext";
import { updateEmail, updatePassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";



const avatarOptions = [
  "/Assets/dog.png",
  "/Assets/duck.png",
  "/Assets/lion.png",
  "/Assets/panda.png",
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousPage = location.state?.from || "/";
  const { currentUser, setCurrentUser } = useAuth();
  // Use currentUser.avatar if available or fallback to null
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || null);
  const [loading, setLoading] = useState(false);

  // Handle avatar change
  const handleAvatarChange = async (info) => {
  };
  
  // Handle email update
  const handleEmailUpdate = async (values) => {
  };

  // Handle password update
  const handlePasswordUpdate = async (values) => {
    const { newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await updatePassword(auth.currentUser, newPassword);
      message.success("Password updated successfully!");
    } catch (error) {
      console.error("Failed to update password:", error);
      message.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      setLoading(true);
      const uid = auth.currentUser.uid;
  
      await updateProfile(auth.currentUser, {
        photoURL: avatarUrl,
      });
  
      await updateDoc(doc(db, "users", uid), {
        avatar: avatarUrl,
      });
  
      await auth.currentUser.reload();
      const refreshedUser = auth.currentUser;
  
      const docSnapshot = await getDoc(doc(db, "users", uid));
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setCurrentUser({
          ...refreshedUser,
          username: userData.username,
          avatar: userData.avatar || refreshedUser.photoURL,
          wins: userData.wins,
          losses: userData.losses,
          friends: userData.friends,
        });
      }
  
      message.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Failed to update avatar:", error);
      message.error("Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };
  
  
  

  return (
    <Card title="Profile" style={{ maxWidth: 400, margin: "50px auto" }}>
     <div style={{ textAlign: "center", marginBottom: 20 }}>
      <Avatar
        size={100}
        src={avatarUrl}
        icon={!avatarUrl && <UserOutlined />}
        style={{ 
          marginBottom: 20,
          border: "2px solid #d9d9d9",
          backgroundColor: "#f5f5f5"
        }}
      />
      <p style={{ 
        fontWeight: "bold", 
        marginBottom: 15,
        fontSize: 16 
      }}>
        Select an Avatar:
      </p>
      
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {avatarOptions.map((url, index) => (
          <Avatar
            key={index}
            src={url}
            size={64}
            style={{
              border: avatarUrl === url ? "3px solid #1890ff" : "2px solid #d9d9d9",
              cursor: "pointer",
              transform: avatarUrl === url ? "scale(1.1)" : "scale(1)",
              transition: "all 0.3s ease",
              boxShadow: avatarUrl === url ? "0 0 10px rgba(24, 144, 255, 0.5)" : "none"
            }}
            onClick={() => setAvatarUrl(url)}
          />
        ))}
      </div>
      
  <Button 
    type="primary" 
    onClick={handleSaveAvatar}
    loading={loading}
    style={{ 
      marginTop: 10,
      width: "150px",
      height: "40px",
      fontSize: 16
    }}
  >
    Save Avatar
  </Button>
</div>

      <div style={{ marginBottom: 20 }}>
        <p>
          <strong>Username:</strong> {currentUser?.username || "N/A"}
        </p>
      </div>
      <Form
        layout="vertical"
        onFinish={handleEmailUpdate}
        initialValues={{ email: currentUser?.email }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Email
          </Button>
        </Form.Item>
      </Form>
      <Form layout="vertical" onFinish={handlePasswordUpdate}>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Please input your new password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your new password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Password
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center", marginTop: 30 }}>
      <Button type="default" onClick={() => navigate(previousPage)}>
        Return to Game
      </Button>
    </div>
    </Card>
  );
};

export default ProfilePage;
