import { motion } from 'framer-motion';

export default function ExpertCard({ expert, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100"
    >
      <motion.h3 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: (index * 0.1) + 0.2 }}
        className="text-xl font-bold text-gray-800"
      >
        {expert.name}
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (index * 0.1) + 0.3 }}
        className="text-gray-600 mt-1"
      >
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
          {expert.city}
        </span>
        {expert.specialization && (
          <span className="text-sm text-gray-500">{expert.specialization}</span>
        )}
      </motion.p>
      
      <motion.p 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: (index * 0.1) + 0.4, type: 'spring' }}
        className="text-sm text-gray-600 mt-3"
      >
        ⭐ {expert.rating} · {expert.experience} years exp
      </motion.p>
      
      {expert.verified && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index * 0.1) + 0.5 }}
          className="text-green-600 text-sm flex items-center mt-2"
        >
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </motion.p>
      )}
      
      {/* Phone number agar available ho to */}
      {expert.phone && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index * 0.1) + 0.6 }}
          className="text-sm text-gray-500 mt-2"
        >
          📞 {expert.phone}
        </motion.p>
      )}
      
      {/* Email agar available ho to */}
      {expert.email && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index * 0.1) + 0.7 }}
          className="text-sm text-gray-500 mt-1"
        >
          ✉️ {expert.email}
        </motion.p>
      )}
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
          Contact
        </button>
      </motion.div>
    </motion.div>
  );
}