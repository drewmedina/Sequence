import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../Firebase/firebase"
const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext);
  }

  export function AuthProvider ({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signin(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setCurrentUser(userCredential.user);
            });
    }
    
    function signup(email, password){
        return createUserWithEmailAndPassword(auth, email, password)
    }
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user)
        setLoading(false)
      })
      return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        signin
      }
    return (
        <AuthContext.Provider value={value}>
        {!loading && children }
        </AuthContext.Provider>
    )
}
