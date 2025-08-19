import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/all_users', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.bool) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">All Users</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-white font-medium">Username</th>
                  <th className="px-6 py-3 text-left text-white font-medium">Email</th>
                  <th className="px-6 py-3 text-left text-white font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-white font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                    <td className="px-6 py-4 text-white">{user.username}</td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.type === 'admin' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                      }`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs bg-green-500 text-white">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-4 text-gray-400">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </Layout>
  );
}