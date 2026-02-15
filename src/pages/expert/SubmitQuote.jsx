import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // 👈 Single import line
import { useExpert } from '../../hooks/useExpert';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { motion } from 'framer-motion';

export default function SubmitQuote() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { expertData, loading: expertLoading } = useExpert();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    price: '',
    description: '',
    estimatedDays: ''
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const problemDoc = await getDoc(doc(db, 'problems', problemId));
        if (problemDoc.exists()) {
          setProblem({ id: problemDoc.id, ...problemDoc.data() });
        } else {
          alert('Problem not found');
          navigate('/expert/problems');
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!expertData) return;

    setSubmitting(true);
    try {
      // 1. Save quote
      const quoteRef = await addDoc(collection(db, 'quotes'), {
        problemId,
        expertId: expertData.id,
        expertEmail: expertData.email,
        expertName: expertData.name,
        price: Number(formData.price),
        description: formData.description,
        estimatedDays: Number(formData.estimatedDays),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 2. Create notification for problem owner
      if (problem && problem.userId) {
        await addDoc(collection(db, 'notifications'), {
          userId: problem.userId,
          type: 'new_quote',
          problemId: problemId,
          problemTitle: `${problem.deviceType} in ${problem.city}`,
          expertId: expertData.id,
          expertName: expertData.name,
          quoteId: quoteRef.id,
          read: false,
          createdAt: serverTimestamp()
        });
      }

      alert('Quote submitted successfully!');
      navigate('/expert/problems');
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Failed to submit quote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || expertLoading) {
    return <LoadingSpinner size="lg" text="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold mb-6">Submit Quote</h1>

          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="font-semibold text-lg">Problem Details</h2>
            <p><strong>Device:</strong> {problem.deviceType}</p>
            <p><strong>City:</strong> {problem.city}</p>
            <p><strong>Description:</strong> {problem.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Quote Price (PKR) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Quote Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Explain what you'll do, parts needed, etc."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Estimated Days *</label>
              <input
                type="number"
                name="estimatedDays"
                value={formData.estimatedDays}
                onChange={handleChange}
                required
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Quote'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}