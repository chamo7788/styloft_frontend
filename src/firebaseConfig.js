// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWx2yZLGV6LlDRzWN6il182qf7QSHyUjI",
  authDomain: "styloft-d3299.firebaseapp.com",
  projectId: "styloft-d3299",
  storageBucket: "styloft-d3299.firebasestorage.app",
  messagingSenderId: "179587982655",
  appId: "1:179587982655:web:f3d04a7ac3cb5863145f8a",
  measurementId: "G-M0DVTYB6X9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export {db, auth};


export const googleProvider = new GoogleAuthProvider();
