import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useExpert } from '../../hooks/useExpert';

export default function AvailableProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { expertData } = useExpert();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        // Get all problems with status 'pending'
        const q = query(
          collection(db, 'problems'),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const problemsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        setProblems(problemsList);
      } catch (error) {
        console.error('Error fetching problems:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading available problems..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Problems</h1>

        {problems.length === 0 ? (
          <p className="text-center text-gray-500">No pending problems at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{problem.deviceType}</h3>
                <p className="text-gray-600 mb-2">{problem.city}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{problem.description}</p>
                <p className="text-sm text-gray-500 mb-4">
                  Posted: {problem.createdAt?.toLocaleDateString()}
                </p>
                <Link
                  to={`/expert/submit-quote/${problem.id}`}
                  className="inline-block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Submit Quote
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}