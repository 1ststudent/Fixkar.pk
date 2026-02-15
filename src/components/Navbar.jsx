import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useExpert } from '../hooks/useExpert';


export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { isExpert } = useExpert();
  {isExpert && (
  <Link to="/expert/problems" className="text-gray-700 hover:text-blue-600 transition">
    Available Problems
  </Link>
)}

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className="bg-white shadow-md sticky top-0 z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="text-2xl font-bold text-blue-600">
              FixKar.pk
            </Link>
          </motion.div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
            <Link to="/submit" className="text-gray-700 hover:text-blue-600 transition">Submit Problem</Link>
            <Link to="/experts" className="text-gray-700 hover:text-blue-600 transition">Experts</Link>


          {currentUser && (
            <Link 
              to="/my-submissions" 
              className="text-gray-700 hover:text-blue-600 transition"
            >
               My Submissions
            </Link>
            )}

            {currentUser ? (
              // Agar user logged in hai to email aur logout dikhao
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{currentUser.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Agar logged out hai to Login/Signup links
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}