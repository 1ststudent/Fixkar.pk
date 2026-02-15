import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function MySubmissions() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Fetch user's submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!currentUser) return;

       console.log('🔍 Fetching submissions for user:', currentUser.uid);

      try {
        // Query problems where userId = currentUser.uid
        const q = query(
          collection(db, 'problems'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc') // Latest first
        );

        const querySnapshot = await getDocs(q);
        console.log('📦 Query snapshot empty?', querySnapshot.empty);
        console.log('📦 Number of documents:', querySnapshot.size);

         const submissionsList = querySnapshot.docs.map(doc => {
        console.log('📄 Document:', doc.id, doc.data());
        return {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        };
      });

      setSubmissions(submissionsList);
    } catch (error) {
      console.error('❌ Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchSubmissions();
}, [currentUser]);

  // Helper function to get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading your submissions..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center text-gray-800 mb-8"
        >
          My Submissions
        </motion.h1>

        {submissions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl shadow-sm"
          >
            <p className="text-gray-500 text-lg mb-4">You haven't submitted any problems yet.</p>
            <button
              onClick={() => navigate('/submit')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Your First Problem
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {submission.deviceType || 'Device'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(submission.status)}`}>
                        {submission.status || 'Pending'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">City:</span> {submission.city || 'Not specified'}
                    </p>
                    
                    <p className="text-gray-700 mb-3">
                      {submission.description || 'No description provided'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>📅 {submission.createdAt?.toLocaleDateString() || 'Date unknown'}</span>
                      {submission.imageURL && (
                        <a 
                          href={submission.imageURL} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          📷 View Image
                        </a>
                      )}
                    </div>
                    <Link
  to={`/my-submissions/${submission.id}/quotes`}
  className="text-blue-600 hover:underline text-sm block mt-2"
>
  View Quotes
</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}