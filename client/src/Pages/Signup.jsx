// Signup.jsx
import React, { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { Form, Input, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./../Styling/Signup.css";

function Signup() {
  // State for form fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (e) => {
    try {
      await signup(email, username, password, confirmpassword);
      navigate("/"); // Redirect to home after successful signup
    } catch (e) {
      toast.error(e.message); // Show error toast if signup fails
    }
  };

  // Navigate to login page
  const loginButton = (e) => {
    navigate("/login");
  };

  return (
    <>
      {/* Toast container for displaying success/error messages */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Box className="background">
        <Stack direction="row" className="signup-container">
          {/* Left side: signup form */}
          <Box className="left-box">
            <Stack className="left-stack">
              <h1 className="form-heading">Create An Account!</h1>
              <Form name="signup" layout="vertical" onFinish={onSubmit}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Email Address!",
                    },
                  ]}
                >
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input a username!" },
                  ]}
                >
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your Password!" },
                  ]}
                >
                  <Input.Password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirm-password"
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your Password!",
                    },
                  ]}
                >
                  <Input.Password
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-button"
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>

              {/* Link to login if user already has an account */}
              <p className="bottom-text">
                Already have an account?{" "}
                <Button type="link" onClick={loginButton}>
                  <b>Log In</b>
                </Button>
              </p>
            </Stack>
          </Box>

          {/* Right side: logo images */}
          <Box className="right-box">
            <Box className="logo-container">
              <img src="/Assets/Card.png" className="card-image" alt="Card" />
              <img
                src="/Assets/SequenceLogo.png"
                className="logo-image"
                alt="Logo"
              />
            </Box>
          </Box>
        </Stack>
      </Box>
    </>
  );
}

export default Signup;
