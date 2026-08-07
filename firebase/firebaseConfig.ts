import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqc3tm4s2Va1WzXdzRb8bObM1ULxCW6Og",
  authDomain: "yogamanagementmobile.firebaseapp.com",
  projectId: "yogamanagementmobile",
  storageBucket: "yogamanagementmobile.firebasestorage.app",
  messagingSenderId: "1047680003237",
  appId: "1:1047680003237:web:c9fd0b2bf7846eec9bb14c",
};

const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);