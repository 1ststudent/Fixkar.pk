import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalExperts: 0,
    totalUsers: 0,
    pendingProblems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get all problems
        const problemsSnap = await getDocs(collection(db, 'problems'));
        const problems = problemsSnap.docs.map(doc => doc.data());
        
        // Get all experts
        const expertsSnap = await getDocs(collection(db, 'experts'));
        
        // Get all users (from auth - but that's more complex, let's skip for now)
        
        setStats({
          totalProblems: problems.length,
          totalExperts: expertsSnap.size,
          totalUsers: 0, // Will implement later
          pendingProblems: problems.filter(p => p.status === 'pending').length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Problems', value: stats.totalProblems, color: 'bg-blue-500', link: '/admin/problems' },
    { title: 'Pending Problems', value: stats.pendingProblems, color: 'bg-yellow-500', link: '/admin/problems' },
    { title: 'Total Experts', value: stats.totalExperts, color: 'bg-green-500', link: '/admin/experts' },
    { title: 'Total Users', value: 'Coming Soon', color: 'bg-purple-500', link: '/admin/users' },
  ];

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className={`${card.color} rounded-lg shadow-lg p-6 text-white hover:opacity-90 transition`}
          >
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-3xl font-bold">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            to="/admin/experts/add"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">Add New Expert</h3>
            <p className="text-gray-600">Register a new repair expert</p>
          </Link>
          <Link
            to="/admin/problems"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">Review Problems</h3>
            <p className="text-gray-600">Check pending repair requests</p>
          </Link>
        </div>
      </div>
    </div>
  );
}