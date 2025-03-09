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

  // Handle avatar change
  
  // Handle email update

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
          beforeUpload={() => false} 
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
