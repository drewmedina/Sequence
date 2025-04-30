// ProfilePage.jsx
import React, { useState } from "react";
import { Card, Form, Input, Button, Upload, Avatar, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../Auth/AuthContext";
import { updateEmail, updatePassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";



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
      const uid = auth.currentUser.uid;
  
      await updateDoc(doc(db, "users", uid), {
        avatar: avatarUrl,
      });
  
      await updateProfile(auth.currentUser, {
        photoURL: avatarUrl,
      });
  
      setCurrentUser((prev) => ({
        ...prev,
        avatar: avatarUrl,
      }));
  
      message.success("avatar wass updated!");
    } catch (error) {
      console.error("avatar update failed", error);
      message.error("could not update avatar");
    }
  };
  

  return (
    <Card title="Profile" style={{ maxWidth: 400, margin: "50px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar
          size={100}
          src={avatarUrl}
          icon={!avatarUrl && <UserOutlined />}
          style={{ marginBottom: 10 }}
          />
          <p style={{ fontWeight: "bold", marginBottom: 5 }}>Select an Avatar:</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            {avatarOptions.map((url, index) => (
              <Avatar
                key={index}
                src={url}
                size={64}
                style={{
                  border: avatarUrl === url ? "3px solid #5f9341" : "2px solid #ccc",
                  cursor: "pointer",
                  transition: "0.2s ease",
                }}
                onClick={() => setAvatarUrl(url)}
              />
            ))}
          </div>
          <Button type="primary" onClick={handleSaveAvatar}>
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
