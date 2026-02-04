// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "APIKey",
  authDomain: "DomainName",
  projectId: "projectId",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
