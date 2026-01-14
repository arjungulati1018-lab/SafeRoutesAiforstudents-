// firebase.js
// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjQsSFYs02U_sQmkuDA6v770ZPLrrun4A",
  authDomain: "saferoutesai-add86.firebaseapp.com",
  projectId: "saferoutesai-add86",
  storageBucket: "saferoutesai-add86.firebasestorage.app",
  messagingSenderId: "2584628831",
  appId: "1:2584628831:web:b33bf0952f0a9a4f6995ea"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
