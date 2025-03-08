// RootLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

function RootLayout() {
  return (
    <div style={{ overflow: "hidden", height: "100vh", width: "100vw" }}>
      <Header />
      <div style={{ height: "94%" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default RootLayout;
