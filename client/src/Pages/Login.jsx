// Login.jsx
import React, { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { Form, Input, Button } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./../Styling/Login.css";

function Login() {
  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signin } = useAuth();
  const navigate = useNavigate();

  // Called when the user submits the form
  const onSubmit = async (e) => {
    try {
      await signin(email, password);
      navigate("/");
    } catch (e) {
      toast.error("Error Signing In Please Try Again");
    }
  };

  // Navigate to the signup page
  const signupButton = (e) => {
    navigate("/signup");
  };

  return (
    <>
      {/* Toast container for displaying error messages */}
      <ToastContainer position="top-right" autoClose={5000} />
      <Box className="background">
        <Stack direction="row" className="login-container">
          <Box className="left-box">
            <Stack className="left-stack">
              <h1 className="signin-heading">Sign In!</h1>
              <Form name="login" layout="vertical" onFinish={onSubmit}>
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

              {/* Link to signup page if user doesn't have an account */}
              <p className="signup-text">
                Don't have an account?{" "}
                <Button type="link" onClick={signupButton}>
                  <b>Sign Up</b>
                </Button>
              </p>
            </Stack>
          </Box>

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

export default Login;
