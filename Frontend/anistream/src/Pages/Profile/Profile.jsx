import React, { useState, useEffect } from 'react';
import axios from 'axios';

const { VITE_BACKEND_LINK } = import.meta.env;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    profile_image: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${VITE_BACKEND_LINK}/user_profile`, {
        withCredentials: true
      });
      
      if (response.data.bool && response.data.user) {
        setUser(response.data.user);
        setFormData({
          profile_image: response.data.user.profile_image || ''
        });
      } else {
        setError('Please login to view your profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${VITE_BACKEND_LINK}/edit_profile`, {
        profile_image: formData.profile_image
      }, {
        withCredentials: true
      });
      
      if (response.data.bool) {
        setUser(response.data.user);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className='text-white pb-32 min-h-screen flex justify-center items-center'>
        <div className='text-xl'>Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-white pb-32 min-h-screen flex justify-center items-center'>
        <div className='text-red-400 text-xl'>{error}</div>
      </div>
    );
  }

  return (
    <div className='text-white pb-32'>
      <div className='lg:px-10 lg:py-7 p-5'>
        <h1 className='lg:text-4xl text-3xl lg:mb-7 mb-4 font-funky flex items-center gap-3'>
          <span>👤</span>
          My Profile
        </h1>
        
        <div className='max-w-2xl'>
          <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10'>
            <div className='flex flex-col items-center mb-8'>
              <div className='w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden bg-gray-600 flex items-center justify-center'>
                {user?.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Profile"
                    className='w-full h-full object-cover'
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex items-center justify-center text-4xl text-gray-300 ${user?.profile_image ? 'hidden' : 'flex'}`}>
                  👤
                </div>
              </div>
              <h2 className='text-2xl font-bold mt-4'>{user?.username}</h2>
              <p className='text-gray-400'>{user?.email}</p>
            </div>

            <div className='space-y-6'>
              <div>
                <label className='block text-sm font-medium mb-2'>Username</label>
                <div className='px-4 py-3 bg-white/5 border border-white/10 rounded-lg'>
                  {user?.username}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Email</label>
                <div className='px-4 py-3 bg-white/5 border border-white/10 rounded-lg'>
                  {user?.email}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Profile Image URL</label>
                {editing ? (
                  <input
                    type="url"
                    name="profile_image"
                    value={formData.profile_image}
                    onChange={handleInputChange}
                    placeholder="Enter image URL"
                    className='w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
                  />
                ) : (
                  <div className='px-4 py-3 bg-white/5 border border-white/10 rounded-lg'>
                    {user?.profile_image || 'No custom image set'}
                  </div>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>Account Type</label>
                <div className='px-4 py-3 bg-white/5 border border-white/10 rounded-lg'>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user?.type === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {user?.type === 'admin' ? 'Administrator' : 'User'}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex gap-4 mt-8'>
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className='px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors'
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        profile_image: user.profile_image || ''
                      });
                    }}
                    className='px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors'
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;