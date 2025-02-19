import React from 'react'
import { useAuth } from '../Auth/AuthContext'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';function Header() {
  const { currentUser } = useAuth();
    console.log(currentUser);
  return (
    <header className="header" style={{"backgroundColor":"#000000", "height":"6%", "display":"flex", "alignItems":"center", "justify-content":"space-between"}}>
        <img src="../../Assets/logo.gif" style={{"height":"300%"}}></img>
        {currentUser ? <div style={{"padding":"10px", "display":"flex", "alignItems":"center", "spacing":"5px", "width":"9%", "justifyContent":"space-between"}}><p>{currentUser.username}</p><Avatar size="small" icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }}/></div> : <div></div>}
    </header>
  )
}

export default Header