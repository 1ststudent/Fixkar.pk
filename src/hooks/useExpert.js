import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export function useExpert() {
  const { currentUser } = useAuth();
  const [isExpert, setIsExpert] = useState(false);
  const [expertData, setExpertData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkExpert = async () => {
      if (!currentUser) {
        setIsExpert(false);
        setExpertData(null);
        setLoading(false);
        return;
      }

      try {
        // Query experts collection by email
        const q = query(
          collection(db, 'experts'),
          where('email', '==', currentUser.email)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const expertDoc = querySnapshot.docs[0];
          setIsExpert(true);
          setExpertData({ id: expertDoc.id, ...expertDoc.data() });
        } else {
          setIsExpert(false);
          setExpertData(null);
        }
      } catch (error) {
        console.error('Error checking expert:', error);
        setIsExpert(false);
      } finally {
        setLoading(false);
      }
    };

    checkExpert();
  }, [currentUser]);

  return { isExpert, expertData, loading };
}