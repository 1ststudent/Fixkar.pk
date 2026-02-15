import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function ManageExperts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'experts'));
      const expertsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExperts(expertsList);
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expert?')) {
      try {
        await deleteDoc(doc(db, 'experts', id));
        setExperts(experts.filter(expert => expert.id !== id));
      } catch (error) {
        console.error('Error deleting expert:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading experts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Experts</h1>
        <Link
          to="/admin/experts/add"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add New Expert
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Specialization</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Experience</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Verified</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {experts.map((expert) => (
              <tr key={expert.id}>
                <td className="px-6 py-4">{expert.name}</td>
                <td className="px-6 py-4">{expert.city}</td>
                <td className="px-6 py-4">{expert.specialization}</td>
                <td className="px-6 py-4">{expert.experience} years</td>
                <td className="px-6 py-4">{expert.rating} ⭐</td>
                <td className="px-6 py-4">
                  {expert.verified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-gray-400">Not Verified</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/admin/experts/edit/${expert.id}`}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(expert.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}