import React from 'react'
import Avatar from 'antd/es/avatar/Avatar'
import { useAuth } from '../Auth/AuthContext'
function UserWaitingComponent(user) {
    console.log(user.username);
  return (
    <div style={{"display":"flex", "flexDirection":"row", "justifyContent":"center", "backgroundColor":"d2b48c"}}>
        <Avatar></Avatar>
        <p>{user.username}</p>
    </div>
  )
}

export default UserWaitingComponent