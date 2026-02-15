import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function useAdmin() {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      console.log('🔍 Checking admin for user:', currentUser?.email);
      
      if (!currentUser) {
        console.log('No user, setting isAdmin=false');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Querying admins collection for email:', currentUser.email);
        const q = query(
          collection(db, 'admins'),
          where('email', '==', currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        
        console.log('Query result empty?', querySnapshot.empty);
        console.log('Number of admin docs found:', querySnapshot.docs.length);
        
        if (!querySnapshot.empty) {
          console.log('Admin doc data:', querySnapshot.docs[0].data());
        }
        
        setIsAdmin(!querySnapshot.empty);
      } catch (error) {
        console.error('❌ Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        console.log('✅ Admin check complete. isAdmin:', isAdmin);
        setLoading(false);
      }
    };

    checkAdmin();
  }, [currentUser]);

  return { isAdmin, loading };
}