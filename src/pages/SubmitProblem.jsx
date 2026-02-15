import { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';  // 👈 YEH IMPORT ADD KARO (Line 6)
import { useNavigate, Link } from 'react-router-dom';    // 👈 Agar redirect karna ho to

export default function SubmitProblem() {
  // 👇 YEH USE AUTH HOOK ADD KARO (currentUser lene ke liye)
  const { currentUser } = useAuth();
  const navigate = useNavigate();  // Agar redirect karna ho to

  const [formData, setFormData] = useState({
    deviceType: '',
    description: '',
    city: '',
    image: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 👇 AGAR USER LOGIN NAHI HAI TO REDIRECT (Optional)
    if (!currentUser) {
      alert('Please login first to submit a problem');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      let imageURL = '';
      
      if (formData.image) {
        const imageRef = ref(storage, `problems/${Date.now()}_${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        imageURL = await getDownloadURL(imageRef);
      }

      // 🔥 YAHAN USER ID ADD KI HAI (Line 46-55)
      const docRef = await addDoc(collection(db, 'problems'), {
        deviceType: formData.deviceType,
        description: formData.description,
        city: formData.city,
        imageURL: imageURL,
        createdAt: new Date(),
        status: 'pending',
        userId: currentUser?.uid || null,        // 👈 USER ID YAHAN ADD HUI
        userEmail: currentUser?.email || null    // 👈 USER EMAIL BHI ADD KAR DIYA (optional)
      });

      console.log('✅ Document saved with ID: ', docRef.id);
      alert('🎉 Problem submitted successfully!');
      
      setFormData({
        deviceType: '',
        description: '',
        city: '',
        image: null
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Kuch error aaya hai. Phir se try karo.');
    } finally {
      setLoading(false);
    }
  };

  // 👇 YAHAN SE RETURN STATEMENT SHURU HOTA HAI (same as before)
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-12 px-4"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <motion.h2 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-center text-gray-800 mb-8"
          >
            Submit Your Repair Issue
          </motion.h2>
          
          {/* Agar user login nahi hai to warning dikhao */}
          {!currentUser && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              Please <Link to="/login" className="font-bold underline">login</Link> to submit a problem
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Device Type Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-gray-700 font-medium mb-2">
                Device Type *
              </label>
              <select
                name="deviceType"
                value={formData.deviceType}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Device</option>
                <option value="amplifier">Amplifier</option>
                <option value="mobile">Mobile</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="laptop">Laptop</option>
                <option value="other">Other</option>
              </select>
            </motion.div>

            {/* Description Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 font-medium mb-2">
                Problem Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the issue in detail..."
              />
            </motion.div>

            {/* City Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-gray-700 font-medium mb-2">
                Your City *
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select City</option>
                <option value="lahore">Lahore</option>
                <option value="karachi">Karachi</option>
                <option value="islamabad">Islamabad</option>
                <option value="rawalpindi">Rawalpindi</option>
                <option value="faisalabad">Faisalabad</option>
                <option value="multan">Multan</option>
              </select>
            </motion.div>

            {/* Image Upload Field */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-gray-700 font-medium mb-2">
                Upload Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
            >
              <button
                type="submit"
                disabled={loading || !currentUser}  // 👉 Disable if not logged in
                className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
                  loading || !currentUser
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit Problem'}
              </button>
            </motion.div>

          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}