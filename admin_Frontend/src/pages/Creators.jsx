import React from 'react';
import Layout from '../components/Layout';

export default function Creators() {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Content Creators</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Creator Management</h2>
          <p className="text-gray-300 mb-4">
            Manage content creators and their uploaded content on the platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Total Creators</h3>
              <p className="text-2xl font-bold text-blue-400">0</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Active Creators</h3>
              <p className="text-2xl font-bold text-green-400">0</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}