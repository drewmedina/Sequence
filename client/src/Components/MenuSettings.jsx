import React from "react";
import Avatar from "antd/es/avatar/Avatar";
//import { useAuth } from "../Auth/AuthContext";
import { OrderedListOutlined } from "@ant-design/icons";
import styled from "styled-components";

const SettingsButton = styled.div`
  // position: absolute;
  // top: 20px;
  // right: 20px;
  // background-color: #f0f0f0;
  // border-radius: 50%;
  // padding: 10px;
  // cursor: pointer;
  // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  // transition: background-color 0.3s ease;

  // &:hover {
  //   background-color: #ddd;
  // }
  display: flex;
  justify-content: flex-end; 
  height: 40px;
  margin-top: 10px;
  margin-bottom: -80px;
  z-index: 3; 
`;

function MenuSettings() {
  return (

    <div onClick={() => console.log('Clicked!')}>
    <SettingsButton>
    <OrderedListOutlined style={{ fontSize: '24px', color: 'hotpink' }} />
    </SettingsButton>
    </div>
  );
}



export default MenuSettings;
