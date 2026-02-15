import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AllProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'problems'));
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

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'problems', id), {
        status: newStatus
      });
      setProblems(problems.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
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
    return <div className="text-center py-12">Loading problems...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Problems</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Device</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {problems.map((problem) => (
              <tr key={problem.id}>
                <td className="px-6 py-4">
                  {problem.createdAt?.toLocaleDateString() || 'N/A'}
                </td>
                <td className="px-6 py-4">{problem.userEmail || 'Unknown'}</td>
                <td className="px-6 py-4">{problem.deviceType}</td>
                <td className="px-6 py-4">{problem.city}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(problem.status)}`}>
                    {problem.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={problem.status || 'pending'}
                    onChange={(e) => updateStatus(problem.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}