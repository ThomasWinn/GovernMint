// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBtoqWTPNypZf-yYumdzeLTKzTTwLk32LA",
  authDomain: "team-7-project2.firebaseapp.com",
  projectId: "team-7-project2",
  storageBucket: "team-7-project2.appspot.com",
  messagingSenderId: "95663253120",
  appId: "1:95663253120:web:6ecffbf2685fbd204ea865"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// initalize components
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

export const db = firebase.firestore();
