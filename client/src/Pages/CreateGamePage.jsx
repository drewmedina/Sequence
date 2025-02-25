import React, { useEffect, useState } from "react";
import socket from "../Firebase/socket";
import { useAuth } from "../Auth/AuthContext";
import { Avatar } from "antd";
import { UserOutlined } from '@ant-design/icons';
import UserWaitingComponent from "../Components/UserWaitingComponent";
function CreateGamePage() {
  const { currentUser } = useAuth(); 

  return (
    <div style={{"backgroundImage":"url(/Assets/PaperBackground.jpg", "height":"100%", "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover", 
        "display": "flex",  boxShadow: 3,}}>
            <div style={{"display":"flex", "flexDirection":"column", "width":"100%", "alignItems":"center", "marginTop":"6%", "justifyContent":"space-evenly", "marginTop":"2%"}}>
            <div style={{"display":"flex", "flexDirection":"column", "justifyContent":"space-between", "alignItems":"center", "width":"80%", "height":"80%", "backgroundColor":"#4e3b31", "opacity":"93%", "borderRadius":"6px", boxShadow: "2px 4px 6px rgba(1, 1, 1, 1)",}}>
                <UserWaitingComponent user={currentUser}/>
            </div>
            </div>
      </div>
  )
}

export default CreateGamePage