import React, { useState } from "react";
import { Form, Input, Button, Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuth } from "../Auth/AuthContext";
import { updatePassword, updateProfile } from "firebase/auth";
import { auth } from "../Firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/firebase";

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
      message.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (values) => {
    try {
      setLoading(true);
      await auth.currentUser.updateEmail(values.email);
      message.success("Email updated!");
    } catch (error) {
      message.error("Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    try {
      setLoading(true);
      const uid = auth.currentUser.uid;
      await updateProfile(auth.currentUser, { photoURL: avatarUrl });
      await updateDoc(doc(db, "users", uid), { avatar: avatarUrl });

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
      message.error("Failed to update avatar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar
          size={100}
          src={avatarUrl}
          icon={!avatarUrl && <UserOutlined />}
          style={{ marginBottom: 20, border: "2px solid #d9d9d9", backgroundColor: "#f5f5f5" }}
        />
        <p style={{ fontWeight: "bold", fontSize: 16 }}>Select an Avatar:</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "15px", flexWrap: "wrap", marginBottom: 20 }}>
          {avatarOptions.map((url, index) => (
            <Avatar
              key={index}
              src={url}
              size={64}
              onClick={() => setAvatarUrl(url)}
              style={{
                border: avatarUrl === url ? "3px solid #1890ff" : "2px solid #d9d9d9",
                cursor: "pointer",
                transform: avatarUrl === url ? "scale(1.1)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
        <Button type="primary" onClick={handleSaveAvatar} loading={loading}>
          Save Avatar
        </Button>
      </div>

      <p><strong>Username:</strong> {currentUser?.username || "N/A"}</p>

      <Form layout="vertical" onFinish={handleEmailUpdate} initialValues={{ email: currentUser?.email }}>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Enter your email" }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Email
          </Button>
        </Form.Item>
      </Form>

      <Form layout="vertical" onFinish={handlePasswordUpdate}>
        <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: "Enter new password" }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Confirm Password" name="confirmPassword" rules={[{ required: true, message: "Confirm password" }]}>
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
