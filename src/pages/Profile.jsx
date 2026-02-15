import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm">Email</label>
              <p className="text-gray-800 font-medium">{currentUser?.email}</p>
            </div>
            <div>
              <label className="block text-gray-600 text-sm">User ID</label>
              <p className="text-gray-800 font-medium">{currentUser?.uid}</p>
            </div>
            {/* Yahan aap edit profile ka form add kar sakte ho */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}