import React from 'react'
import { useAuth } from '../Auth/AuthContext'
function Home() {
const {currentUser} = useAuth();
  return (
    <div style={{"backgroundImage":"url(/Assets/PaperBackground.jpg", "width":"100%", "height":"100%","backgroundRepeat": "no-repeat",
      "backgroundSize": "cover", 
      "display": "flex", 
      "justifyContent": "center", 
      "alignItems": "center"}}>
      <img src="../../Assets/logo.gif" style={{}}/>
    </div>
  )
}

export default Home