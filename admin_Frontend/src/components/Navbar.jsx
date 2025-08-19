import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Users, DollarSign, ArrowDownToLine, ArrowUpFromLine, Settings } from "lucide-react";

export default function Navbar() {
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
    <>
      {/* Top Header */}
      <div className="flex justify-between items-center p-6 pb-0">
        <div className="text-2xl font-bold text-white">anistream</div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <span>{adminUser.username}</span>
            <div className="relative">
              <div 
                className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:bg-red-600 transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                D
              </div>
              {showDropdown && (
                <div className="absolute top-12 right-0 bg-gray-800 border border-gray-600 rounded-lg shadow-lg min-w-[150px] z-50">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-600 text-white flex items-center gap-2 rounded-lg"
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </>
  )

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-20 flex flex-col items-center py-8 space-y-12">
      <div className={`flex flex-col items-center cursor-pointer ${isActive('/dashboard') ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`} onClick={() => navigate('/dashboard')}>
        <div className={`p-4 rounded-xl mb-2 ${isActive('/dashboard') ? 'bg-red-500' : 'hover:bg-white/10'}`}>
          <Home size={24} className="text-white"/>
        </div>
        <div className="text-xs text-center">Dashboard</div>
      </div>
      <div className={`flex flex-col items-center cursor-pointer ${isActive('/users') ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`} onClick={() => navigate('/users')}>
        <div className={`p-4 rounded-xl mb-2 ${isActive('/users') ? 'bg-red-500' : 'hover:bg-white/10'}`}>
          <Users size={24} className="text-white"/>
        </div>
        <div className="text-xs text-center">Users</div>
      </div>
      <div className="flex flex-col items-center opacity-70">
        <div className="p-4 rounded-xl mb-2"><DollarSign size={24}/></div>
        <div className="text-xs text-center">Withdrawal</div>
      </div>
      <div className="flex flex-col items-center opacity-70">
        <div className="p-4 rounded-xl mb-2"><ArrowUpFromLine size={24}/></div>
        <div className="text-xs text-center">Deposit</div>
      </div>
      <div className="flex flex-col items-center opacity-70">
        <div className="p-4 rounded-xl mb-2"><ArrowDownToLine size={24}/></div>
        <div className="text-xs text-center">Transactions</div>
      </div>
      <div className="flex flex-col items-center opacity-70">
        <div className="p-4 rounded-xl mb-2"><Settings size={24}/></div>
        <div className="text-xs text-center">Settings</div>
      </div>
    </div>
  );
}