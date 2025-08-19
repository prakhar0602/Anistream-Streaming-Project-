import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8080/verify_token', {
          credentials: 'include'
        });
        const data = await response.json();
        setIsAuthenticated(data.bool && data.type === 'admin');
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}