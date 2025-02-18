import React from 'react'
import { useAuth } from '../Auth/AuthContext'
function Home() {
const {currentUser} = useAuth();
  return (
    <div>WELCOME {currentUser.email}
    <div style={{"width":"20%"}}><iframe src="https://giphy.com/embed/exXM4heNCkJg1TrXMK" width="100%" height="100%" style={{"position":"absolute"}} frameBorder="0" class="giphy-embed" allowFullScreen></iframe></div><p><a href="https://giphy.com/stickers/transparent-exXM4heNCkJg1TrXMK">via GIPHY</a></p></div>
  )
}

export default Home