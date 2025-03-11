import React from "react";
import { useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase/firebase";
const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signin(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return getDoc(doc(db, "users", user.uid));
      })
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setCurrentUser({
            ...auth.currentUser,
            username: userData.username,
            avatar: userData.avatar,
            wins: userData.wins,
            losses: userData.losses,
            friends: userData.friends,
          });
        }
      });
  }

  function signup(email, username, password, confirmpassword) {
    if (password != confirmpassword) {
      throw new Error("Passwords Do Not Match");
    }
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return setDoc(doc(db, "users", user.uid), {
          username: username,
          avatar: "avatar",
          email: email,
          wins: 0,
          losses: 0,
          friends: [],
        });
      })
      .then(() => {
        setCurrentUser({ ...auth.currentUser, username });
      })
      .catch((e) => {
        console.log(e);
        throw new Error(e.code);
      });
  }

  function logout() {
    return auth.signOut();
  }


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docSnapshot = await getDoc(doc(db, "users", user.uid));
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setCurrentUser({
              ...user,
              username: userData.username,
              avatar: userData.avatar,
              wins: userData.wins,
              losses: userData.losses,
              friends: userData.friends,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    signin,
    logout,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
