import React, { useState, useEffect } from 'react';
import { plantApi } from '../../shared/api';

export default function ApiTest() {
  const [plants, setPlantsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await plantApi.getPlantList();
        setPlantsData(response);
        console.log('Plants data:', response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching plants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">API Test - Plant List</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(plants, null, 2)}
      </pre>
    </div>
  );
}
