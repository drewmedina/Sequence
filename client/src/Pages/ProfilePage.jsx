// ProfilePage.jsx
import React, { useState } from "react";
import { Card, Form, Input, Button, Upload, Avatar, message } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../Auth/AuthContext";
import { updateEmail, updatePassword } from "firebase/auth";
import { auth } from "../Firebase/firebase";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  // Use currentUser.avatar if available or fallback to null
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || null);
  const [loading, setLoading] = useState(false);

  // Handle avatar change. In a full implementation, you would upload the file
  // (e.g., to Firebase Storage) and update your user document with the new URL.
  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result);
      message.success("Avatar updated!");
      // TODO: Upload the file to your storage and update the user's profile
    };
    reader.readAsDataURL(file);
  };

  // Handle email update
  const handleEmailUpdate = async (values) => {
    const { email } = values;
    try {
      setLoading(true);
      await updateEmail(auth.currentUser, email);
      message.success("Email updated successfully!");
      // Optionally, update the email in your Firestore user document as well.
    } catch (error) {
      console.error("Failed to update email:", error);
      message.error("Failed to update email");
    } finally {
      setLoading(false);
    }
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

  return (
    <Card title="Profile" style={{ maxWidth: 400, margin: "50px auto" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <Avatar
          size={100}
          src={avatarUrl}
          icon={!avatarUrl && <UserOutlined />}
        />
        <Upload
          showUploadList={false}
          beforeUpload={() => false} // Prevent auto-upload
          onChange={handleAvatarChange}
        >
          <Button icon={<UploadOutlined />} style={{ marginTop: 10 }}>
            Change Avatar
          </Button>
        </Upload>
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
    </Card>
  );
};

export default ProfilePage;
