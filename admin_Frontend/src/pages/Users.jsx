import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Users() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/online_users', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.bool) {
          setOnlineUsers(data.onlineUsers);
        }
      } catch (error) {
        console.error('Failed to fetch online users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOnlineUsers();
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <div className="text-3xl font-bold mb-6">Users Management</div>
      <div className="bg-gray-800 rounded-2xl p-6">
        <div className="text-xl font-semibold mb-4">Online Users ({onlineUsers.length})</div>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : onlineUsers.length === 0 ? (
          <div className="text-gray-400">No users currently online</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-3 text-red-300">Username</th>
                  <th className="pb-3 text-red-300">Email</th>
                  <th className="pb-3 text-red-300">Type</th>
                  <th className="pb-3 text-red-300">Login Time</th>
                </tr>
              </thead>
              <tbody>
                {onlineUsers.map((user, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                    <td className="py-3">{user.username}</td>
                    <td className="py-3 text-gray-300">{user.email}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.type === 'admin' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">
                      {new Date(user.loginTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
}