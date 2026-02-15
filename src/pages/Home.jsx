import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center text-white px-4 relative overflow-hidden">
      
      {/* Animated background circles */}
      <motion.div 
        className="absolute w-96 h-96 bg-white opacity-5 rounded-full"
        animate={{ 
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        style={{ top: '10%', left: '5%' }}
      />
      
      <motion.div 
        className="absolute w-64 h-64 bg-white opacity-5 rounded-full"
        animate={{ 
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        style={{ bottom: '10%', right: '5%' }}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-3xl relative z-10"
      >
        <motion.h1 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
        >
          Repair Anything.
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-yellow-300"
          >
            Anywhere in Pakistan.
          </motion.span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xl md:text-2xl mb-10 opacity-90"
        >
          Connect with verified repair experts from major cities. No more traveling.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/submit"
              className="inline-block bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-opacity-90 transition shadow-lg"
            >
              Submit Problem
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/experts"
              className="inline-block border-2 border-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-700 transition shadow-lg"
            >
              Find Experts
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}