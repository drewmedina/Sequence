// ProfileContent.jsx
import React, { useState } from "react";
import { Form, Input, Button, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../Auth/AuthContext";
import { updatePassword, updateProfile } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";
import "./../Styling/ProfileContent.css";

// List of available avatar image URLs
const avatarOptions = [
  "/Assets/dog.png",
  "/Assets/duck.png",
  "/Assets/lion.png",
  "/Assets/panda.png",
];

const ProfileContent = ({ onClose }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || null);
  const [loading, setLoading] = useState(false);

  // Update user's password if new and confirmed match
  const handlePasswordUpdate = async (values) => {
    const { newPassword, confirmPassword } = values;
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await updatePassword(auth.currentUser, newPassword);
      message.success("Password updated successfully!");
    } catch {
      message.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Update user's email address
  const handleEmailUpdate = async (values) => {
    setLoading(true);
    try {
      await auth.currentUser.updateEmail(values.email);
      message.success("Email updated!");
    } catch {
      message.error("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  // Save selected avatar to Firebase Auth profile and Firestore
  const handleSaveAvatar = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser.uid;
      await updateProfile(auth.currentUser, { photoURL: avatarUrl });
      await updateDoc(doc(db, "users", uid), { avatar: avatarUrl });
      await auth.currentUser.reload();

      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrentUser({
          ...auth.currentUser,
          username: data.username,
          avatar: data.avatar,
          wins: data.wins,
          losses: data.losses,
          friends: data.friends,
        });
      }
      message.success("Avatar updated successfully!");
    } catch {
      message.error("Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {/* Display current or placeholder avatar */}
      <Avatar
        size={100}
        src={avatarUrl}
        icon={!avatarUrl && <UserOutlined />}
        className="profile-avatar"
      />

      <p className="avatar-title">Select an Avatar:</p>

      {/* Show list of selectable avatars */}
      <div className="avatar-options">
        {avatarOptions.map((url, idx) => (
          <Avatar
            key={idx}
            src={url}
            size={64}
            onClick={() => setAvatarUrl(url)}
            className={`option${avatarUrl === url ? " selected" : ""}`}
          />
        ))}
      </div>

      <Button
        type="primary"
        onClick={handleSaveAvatar}
        loading={loading}
        style={{ marginBottom: 20 }}
      >
        Save Avatar
      </Button>

      <p>
        <strong>Username:</strong> {currentUser?.username || "N/A"}
      </p>

      {/* Form to update email */}
      <Form
        layout="vertical"
        onFinish={handleEmailUpdate}
        initialValues={{ email: currentUser?.email }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Enter your email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Email
          </Button>
        </Form.Item>
      </Form>

      {/* Form to update password */}
      <Form layout="vertical" onFinish={handlePasswordUpdate}>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[{ required: true, message: "Enter new password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Confirm password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileContent;
