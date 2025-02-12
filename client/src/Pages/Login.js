import React from 'react'
import { useState } from 'react';
import { useAuth } from "../Auth/AuthContext";
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signup} = useAuth()
    const onSubmit = async (e) => {
        e.preventDefault()
        await signup(email, password);

      }
  return (
    <main >        
        <section>
            <div>
                <div>                  
                    <h1> FocusApp </h1>                                                                            
                    <form>                                                                                            
                        <div>
                            <label htmlFor="email-address">
                                Email address
                            </label>
                            <input
                                type="email"
                                label="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}  
                                required                                    
                                placeholder="Email address"                                
                            />
                        </div>

                        <div>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                label="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                required                                 
                                placeholder="Password"              
                            />
                        </div>                                             

                        <button
                            type="submit" 
                            onClick={onSubmit}                        
                        >  
                            Sign up                                
                        </button>

                    </form>
                  
                </div>
            </div>
        </section>
    </main>
  )
}

export default Login