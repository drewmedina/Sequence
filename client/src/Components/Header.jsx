import React from 'react'
import { useAuth } from '../Auth/AuthContext'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';

function Header() {
  const { currentUser } = useAuth();
    console.log(currentUser);
  return (
    <header className="header" style={{
        backgroundColor: "#4e3b31",
        height: "6%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderBottom: "2px solid #000",
        padding:"2px"
      }}>
        <img src="../../Assets/logo.gif" style={{"height":"60%", "padding":"4px"}}></img>
        {currentUser ? <div style={{"padding":"10px", "display":"flex", "alignItems":"center", "spacing":"5px", "width":"9%", "justifyContent":"space-between"}}><p className='username'>{currentUser.username}</p><Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }}/></div> : <div></div>}
    </header>
  )
}

export default Header