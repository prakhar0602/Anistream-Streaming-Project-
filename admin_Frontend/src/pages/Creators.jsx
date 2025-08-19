import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Eye, Film, Tv } from 'lucide-react';

export default function Creators() {
  const [creators, setCreators] = useState([]);
  const [totalCreators, setTotalCreators] = useState(0);
  const [activeCreators, setActiveCreators] = useState(0);
  const [totalContent, setTotalContent] = useState(0);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [creatorContent, setCreatorContent] = useState({ series: [], movies: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentCreators();
  }, []);

  const fetchContentCreators = async () => {
    try {
      const response = await fetch('http://localhost:8080/content_creators', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.bool) {
        setCreators(data.creators);
        setTotalCreators(data.totalCreators);
        setActiveCreators(data.activeCreators || 0);
        setTotalContent(data.totalContent || 0);
      }
    } catch (error) {
      console.error('Failed to fetch content creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreatorContent = async (creatorId) => {
    try {
      const response = await fetch(`http://localhost:8080/creator_content/${creatorId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.bool) {
        setCreatorContent({ series: data.series, movies: data.movies });
      }
    } catch (error) {
      console.error('Failed to fetch creator content:', error);
    }
  };

  const handleViewContent = (creator) => {
    setSelectedCreator(creator);
    fetchCreatorContent(creator._id);
  };



  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Content Creators</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Total Creators</h3>
            <p className="text-2xl font-bold text-blue-400">{totalCreators}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Active Creators</h3>
            <p className="text-2xl font-bold text-green-400">{activeCreators}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-medium mb-2">Total Content</h3>
            <p className="text-2xl font-bold text-purple-400">
              {totalContent}
            </p>
          </div>
        </div>

        {/* Creators List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">All Content Creators</h2>
          
          {creators.length === 0 ? (
            <p className="text-gray-400">No content creators found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-gray-300 font-medium py-3 px-4">Creator</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Email</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Series</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Movies</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Total Content</th>
                    <th className="text-gray-300 font-medium py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creators.map((creator) => (
                    <tr key={creator._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={creator.profile_image}
                            alt={creator.username}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/32/cccccc/000000?text=CC';
                            }}
                          />
                          <span className="text-white font-medium">{creator.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{creator.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Tv size={16} className="text-blue-400" />
                          <span className="text-blue-400">{creator.seriesCount}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <Film size={16} className="text-red-400" />
                          <span className="text-red-400">{creator.moviesCount}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-purple-400 font-semibold">{creator.totalContent}</span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleViewContent(creator)}
                          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          <Eye size={14} />
                          <span>View Content</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Creator Content Modal */}
        {selectedCreator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedCreator.username}'s Content
                </h3>
                <button
                  onClick={() => setSelectedCreator(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Series */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                    <Tv size={20} className="mr-2" />
                    Series ({creatorContent.series.length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {creatorContent.series.map((series) => (
                      <div key={series._id} className="flex items-center space-x-3 bg-gray-700 p-3 rounded">
                        <img
                          src={series.cover_image}
                          alt={series.name}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48/cccccc/000000?text=S';
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{series.name}</p>
                          <p className="text-yellow-400 text-xs">⭐ {series.avg_rating?.toFixed(1) || '0.0'}</p>
                        </div>
                      </div>
                    ))}
                    {creatorContent.series.length === 0 && (
                      <p className="text-gray-400 text-sm">No series uploaded</p>
                    )}
                  </div>
                </div>

                {/* Movies */}
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-3 flex items-center">
                    <Film size={20} className="mr-2" />
                    Movies ({creatorContent.movies.length})
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {creatorContent.movies.map((movie) => (
                      <div key={movie._id} className="flex items-center space-x-3 bg-gray-700 p-3 rounded">
                        <img
                          src={movie.cover_image}
                          alt={movie.name}
                          className="w-12 h-12 rounded object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48/cccccc/000000?text=M';
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{movie.name}</p>
                          <p className="text-yellow-400 text-xs">⭐ {movie.avg_rating?.toFixed(1) || '0.0'}</p>
                        </div>
                      </div>
                    ))}
                    {creatorContent.movies.length === 0 && (
                      <p className="text-gray-400 text-sm">No movies uploaded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}