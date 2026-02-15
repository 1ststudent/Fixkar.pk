import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import ExpertCard from '../components/ExpertCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Experts() {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'experts'));
        const expertsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('🔥 Firebase se aaya data:', expertsList);
        
        setExperts(expertsList);
        
        // Unique cities with null check
        const validCities = expertsList
          .map(expert => expert?.city)
          .filter(city => city != null);
        
        const uniqueCities = [...new Set(validCities)];
        console.log('🔥 Unique cities:', uniqueCities);
        setCities(uniqueCities);
        
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  // Case-insensitive filter
  const filteredExperts = filterCity
    ? experts.filter(expert => 
        expert.city?.toLowerCase() === filterCity.toLowerCase()
      )
    : experts;

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading experts..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Verified Repair Experts
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Choose from trusted professionals across Pakistan
        </p>

        {cities.length > 0 && (
          <div className="flex justify-center mb-8">
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        )}

        {filteredExperts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert, index) => (
              <ExpertCard 
                key={expert.id} 
                expert={expert} 
                index={index}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {filterCity ? `No experts found in ${filterCity}` : 'No experts available'}
          </p>
        )}
      </div>
    </div>
  );
}