import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';


const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Signup function
  
  async function signup(email, password) {
  // 1. User create karo Firebase Authentication mein
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // 2. Ab user ka document Firestore mein banao (users collection mein)
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email: userCredential.user.email,
    createdAt: new Date(),
    displayName: '',
    phone: '',
    address: '',
    city: ''
  });

  return userCredential;
}

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    return signOut(auth);
  }

  // Auth state change listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}