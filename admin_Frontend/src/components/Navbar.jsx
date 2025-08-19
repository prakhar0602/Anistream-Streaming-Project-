import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, Brain, Eye, UserPlus, Settings } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminUser, setAdminUser] = useState({ username: 'Admin' });
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchAdminUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/user_stats', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.bool && data.adminUser) {
          setAdminUser({ username: data.adminUser.username });
        }
      } catch (error) {
        console.error('Failed to fetch admin user:', error);
      }
    };
    fetchAdminUser();
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.bool) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col justify-between p-6 flex-shrink-0">
      <div>
        <div className="text-2xl font-bold text-white mb-8">anistream</div>
        <div className="space-y-4">
          <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isActive('/dashboard') ? 'bg-red-500' : 'hover:bg-gray-700'}`} onClick={() => navigate('/dashboard')}>
            <Home size={20} className="text-white"/>
            <span className="text-white">Dashboard</span>
          </div>
          <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isActive('/online-users') ? 'bg-red-500' : 'hover:bg-gray-700'}`} onClick={() => navigate('/online-users')}>
            <Users size={20} className="text-white"/>
            <span className="text-white">Online Users</span>
          </div>
          <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isActive('/recommendations') ? 'bg-red-500' : 'hover:bg-gray-700'}`} onClick={() => navigate('/recommendations')}>
            <Brain size={20} className="text-white"/>
            <span className="text-white">Recommendations</span>
          </div>
          <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isActive('/creators') ? 'bg-red-500' : 'hover:bg-gray-700'}`} onClick={() => navigate('/creators')}>
            <UserPlus size={20} className="text-white"/>
            <span className="text-white">Content Creators</span>
          </div>
          <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isActive('/users') ? 'bg-red-500' : 'hover:bg-gray-700'}`} onClick={() => navigate('/users')}>
            <Eye size={20} className="text-white"/>
            <span className="text-white">Users</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg opacity-70">
            <Settings size={20} className="text-white"/>
            <span className="text-white">Settings</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            {adminUser.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-white">{adminUser.username}</span>
        </div>
        {showDropdown && (
          <div className="absolute bottom-full left-0 right-0 bg-gray-700 border border-gray-600 rounded-lg shadow-lg mb-2">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-600 text-white flex items-center gap-2 rounded-lg"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        )}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          ></div>
        )}
      </div>
    </div>
  );
}