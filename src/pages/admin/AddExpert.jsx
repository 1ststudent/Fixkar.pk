import { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function AddExpert() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    specialization: '',
    experience: '',
    rating: '',
    phone: '',
    email: '',
    verified: false
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'experts'), {
        ...formData,
        experience: Number(formData.experience),
        rating: Number(formData.rating)
      });
      navigate('/admin/experts');
    } catch (error) {
      console.error('Error adding expert:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Expert</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Specialization *</label>
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Experience (years) *</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Rating *</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            min="0"
            max="5"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="verified"
            checked={formData.verified}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-gray-700 font-medium">Verified Expert</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Expert'}
        </button>
      </form>
    </div>
  );
}