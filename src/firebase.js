import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tumhari apni config yahan paste karo (jo console se copy ki thi)
const firebaseConfig = {
  apiKey: "AIzaSyCLX3931m6ih4JyXhXtwoDg9jrstpaIi1A",
  authDomain: "fixkar-pk.firebaseapp.com",
  projectId: "fixkar-pk",
  storageBucket: "fixkar-pk.firebasestorage.app",
  messagingSenderId: "881952719349",
  appId: "1:881952719349:web:a0ca1a68dd679cf261e0bc",
  measurementId: "G-MDEH8LLHY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;