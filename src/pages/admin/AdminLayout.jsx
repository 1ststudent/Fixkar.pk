import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          <Link
            to="/admin"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/problems"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            All Problems
          </Link>
          <Link
            to="/admin/experts"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Manage Experts
          </Link>
          <Link
            to="/admin/users"
            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Users
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}