// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtMP66J_vu0W1snbhRnh3rVIY8pceIPew",
  authDomain: "sequence-3bc30.firebaseapp.com",
  projectId: "sequence-3bc30",
  storageBucket: "sequence-3bc30.firebasestorage.app",
  messagingSenderId: "580469336528",
  appId: "1:580469336528:web:a9eb49d5bce5b5de3771d5",
  measurementId: "G-1HXER070H6",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
