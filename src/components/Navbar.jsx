import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useExpert } from '../hooks/useExpert';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const { isExpert } = useExpert();
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-200 rounded-full px-3 py-1 hover:bg-gray-300 focus:outline-none"
                >
                  <span className="text-sm font-medium">
                    {currentUser.email?.charAt(0).toUpperCase()}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border">
                    {/* Profile Link */}
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 My Profile
                    </Link>

                    {/* Settings Link */}
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>

                    {/* My Submissions */}
                    <Link
                      to="/my-submissions"
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      📋 My Submissions
                    </Link>

                    {/* Expert link (if expert) */}
                    {isExpert && (
                      <Link
                        to="/expert/problems"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🔧 Available Problems
                      </Link>
                    )}

                    <hr className="my-1" />

                    {/* Dark Theme Toggle (inside dropdown) */}
                    <div className="px-4 py-2 flex items-center justify-between">
                      <span className="text-gray-800">🌙 Dark Theme</span>
                      <button
                        onClick={toggleTheme}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center justify-between"
                      >
                        <span>{isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {isDark ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    </div>

                    <hr className="my-1" />

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                  Login
                </Link>
                <Link to="/signup" className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition text-sm">
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