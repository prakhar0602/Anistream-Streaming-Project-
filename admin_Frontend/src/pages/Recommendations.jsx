import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function Recommendations() {
  const [isTraining, setIsTraining] = useState(false);

  const handleTrainNow = async () => {
    setIsTraining(true);
    try {
      const response = await fetch('http://localhost:8080/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Training completed:', data);
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Recommendation System</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">ML Recommendation Engine</h2>
          <p className="text-gray-300 mb-4">
            Monitor and manage the machine learning recommendation system for personalized content delivery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">System Status</h3>
              <p className="text-green-400">Active</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-medium mb-2">Last Training</h3>
                  <p className="text-gray-300">2 hours ago</p>
                </div>
                <button 
                  onClick={handleTrainNow}
                  disabled={isTraining}
                  className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg text-sm"
                >
                  {isTraining ? 'Training...' : 'Train Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}