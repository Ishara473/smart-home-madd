import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKKBG1xohSZx8KA6xNFOmmx9anPsAzyzY",
  authDomain: "smart-home-monitoring-sy-38505.firebaseapp.com",
  projectId: "smart-home-monitoring-sy-38505",
  storageBucket: "smart-home-monitoring-sy-38505.firebasestorage.app",
  messagingSenderId: "739819003559",
  appId: "1:739819003559:web:b8fb7d50a40d0517ab8582"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
