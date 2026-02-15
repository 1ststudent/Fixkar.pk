import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
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
            {['Home', 'Submit Problem', 'Experts'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <Link 
                  to={item === 'Home' ? '/' : item === 'Submit Problem' ? '/submit' : '/experts'}
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}