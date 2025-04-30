import React, { useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import { Form, Input, Button } from "antd";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const { signin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    await signin(email, password);
    navigate("/");
  };
  const signupButton = async (e) => {
    e.preventDefault();
    navigate("/signup");
  };
  return (
    <Box
      className="Background"
      sx={{
        fontFamily: "'Cinzel', serif",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/Assets/PaperBackground.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: "80%",
          height: "80%",
          display: "flex",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          marginBottom: "4%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFFFFF",
            padding: 3,
          }}
        >
          <Stack
            direction="column"
            sx={{
              width: "70%",
              justifyContent: "center",
            }}
          >
            <h1 style={{ color: "#000000", textAlign: "center" }}>Sign In!</h1>
            <Form name="basic" layout="vertical">
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
                <Input onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input.Password onChange={(e) => setPassword(e.target.value)} />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={onSubmit}
                  style={{ width: "100%" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
            <p style={{ color: "#000000", textAlign: "center" }}>
              Don't have an account?{" "}
              <Button onClick={signupButton}>
                <b>Sign Up</b>
              </Button>
            </p>
          </Stack>
        </Box>
        <Box
          sx={{
            flex: 1,
            backgroundImage: "url(Assets/CardBackground.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "80%",
            }}
          >
            <img
              src="Assets/Card.png"
              style={{ width: "70%", height: "auto" }}
              alt="Card"
            />
            <img
              src="Assets/SequenceLogo.png"
              style={{ width: "60%", height: "auto" }}
              alt="Logo"
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default Login;
