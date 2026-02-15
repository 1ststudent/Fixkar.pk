import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

export default function ProblemQuotes() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch problem to verify ownership (optional)
        // Fetch quotes for this problem
        const q = query(
          collection(db, 'quotes'),
          where('problemId', '==', problemId),
          where('status', '==', 'pending')
        );
        const querySnapshot = await getDocs(q);
        const quotesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));
        setQuotes(quotesList);
      } catch (error) {
        console.error('Error fetching quotes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [problemId]);

  const handleAcceptQuote = async (quoteId, expertId) => {
    if (!window.confirm('Are you sure you want to accept this quote?')) return;

    setAccepting(true);
    try {
      const batch = writeBatch(db);

      // Update all quotes for this problem: set status to rejected except the accepted one
      const quotesRef = collection(db, 'quotes');
      const q = query(quotesRef, where('problemId', '==', problemId));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.forEach(docSnap => {
        if (docSnap.id === quoteId) {
          batch.update(docSnap.ref, { status: 'accepted' });
        } else {
          batch.update(docSnap.ref, { status: 'rejected' });
        }
      });

      // Update problem status and assigned expert
      const problemRef = doc(db, 'problems', problemId);
      batch.update(problemRef, {
        status: 'in progress',
        assignedExpertId: expertId,
        selectedQuoteId: quoteId
      });

      await batch.commit();
      alert('Quote accepted! Expert has been notified.');
      navigate('/my-submissions');
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert('Failed to accept quote. Try again.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading quotes..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Quotes for Your Problem</h1>

        {quotes.length === 0 ? (
          <p className="text-center text-gray-500">No quotes yet. Check back later.</p>
        ) : (
          <div className="space-y-4">
            {quotes.map((quote, index) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{quote.expertName}</h3>
                    <p className="text-gray-600">{quote.expertEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">PKR {quote.price}</p>
                    <p className="text-sm text-gray-500">Est. {quote.estimatedDays} days</p>
                  </div>
                </div>
                <p className="mt-4 text-gray-700">{quote.description}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleAcceptQuote(quote.id, quote.expertId)}
                    disabled={accepting}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    Accept Quote
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}