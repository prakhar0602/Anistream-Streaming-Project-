import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from '../../../Assets/loading.gif'

import { toast } from 'react-toastify';

const {VITE_BACKEND_LINK}=import.meta.env

const Edit = () => {
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('series');
  const [editingItem, setEditingItem] = useState(null);
  const user = JSON.parse(localStorage.getItem('User') || '{}');
  
  useEffect(() => {
    fetchData('series')
  }, [])
  
  const genreOptions = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", 
    "Romance", "Sci-Fi", "Thriller", "Slice of Life", "Sports", "Supernatural", 
    "Mecha", "Historical", "School", "Military", "Music", "Psychological"
  ];

  const fetchData = async (type) => {
    setLoading(true);
    try {
      const endpoint = type === 'series' ? '/get_series' : '/get_movies';
      const response = await axios.get(`${VITE_BACKEND_LINK}${endpoint}`);
      
      if (type === 'series') {
        setSeries(response.data.series || []);
        setMovies([]);
      } else {
        setMovies(response.data.movies || []);
        setSeries([]);
      }
      setActiveTab(type);
    } catch (error) {
      toast.error(`Failed to fetch ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will delete all related data.`)) {
      try {
        setLoading(true);
        await axios.post(`${VITE_BACKEND_LINK}/delete_anime`, { type, id }, {
          withCredentials: true
        });
        
        if (type === 's') {
          setSeries(series.filter(item => item._id !== id));
        } else {
          setMovies(movies.filter(item => item._id !== id));
        }
        
        toast.success('Anime deleted successfully');
      } catch (error) {
        toast.error('Failed to delete anime');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (formData, id, type) => {
    setLoading(true);
    try {
      const payload = {
        id,
        name: formData.name,
        cover_image: formData.cover_image,
        cover_image2: formData.cover_image2 || formData.cover_image,
        big_image: formData.big_image,
        desc: formData.desc,
        fld_id: formData.fld_id,
        nseasons: formData.nseasons,
        type: activeTab,
        genres: formData.genres || []
      };
      console.log('Sending payload:', payload)
      const response = await axios.post(`${VITE_BACKEND_LINK}/edit_anime`, payload,{
        withCredentials: true,
        timeout: 120000
      });
      console.log('Edit response:', response.data)
      
      toast.success('Anime updated successfully');
      setEditingItem(null);
      await fetchData(activeTab);
    } catch (error) {
      console.error('Edit error:', error);
      if (error.code === 'ECONNRESET' || error.message.includes('timeout')) {
        toast.info("Processing... Please check if anime was updated successfully");
      } else {
        toast.error('Failed to update anime');
      }
    } finally {
      setLoading(false);
    }
  };

  const EditForm = ({ item, type, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: item.name,
      cover_image: item.cover_image,
      cover_image2: item.cover_image2 || '',
      big_image: item.big_image,
      desc: item.desc,
      fld_id: item.fld_id,
      nseasons: item.nseasons,
      genres: item.genres || []
    });
    
    const handleSubmit = (e) => {
      e.preventDefault();
      // console.log(formData)
      onSave(formData, item._id, type);
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1a1a] rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4">Edit {item.name}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="p-3 rounded bg-gray-800 text-white border border-gray-600"
                required
              />
              <input
                type="text"
                placeholder="Cover Image URL"
                value={formData.cover_image}
                onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                className="p-3 rounded bg-gray-800 text-white border border-gray-600"
              />
              <input
                type="text"
                placeholder="Cover Image 2 URL"
                value={formData.cover_image2}
                onChange={(e) => setFormData({...formData, cover_image2: e.target.value})}
                className="p-3 rounded bg-gray-800 text-white border border-gray-600"
              />
              <input
                type="text"
                placeholder="Big Image URL"
                value={formData.big_image}
                onChange={(e) => setFormData({...formData, big_image: e.target.value})}
                className="p-3 rounded bg-gray-800 text-white border border-gray-600"
              />
              <input
                type="text"
                placeholder="Folder ID"
                value={formData.fld_id}
                onChange={(e) => setFormData({...formData, fld_id: e.target.value})}
                className="p-3 rounded bg-gray-800 text-white border border-gray-600"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Seasons"
                  value={formData.nseasons}
                  onChange={(e) => setFormData({...formData, nseasons: e.target.value})}
                  className="p-3 rounded bg-gray-800 text-white border border-gray-600"
                />
              </div>
            </div>
            <textarea
              placeholder="Description"
              value={formData.desc}
              onChange={(e) => setFormData({...formData, desc: e.target.value})}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 h-24"
            />
            <div>
              <label className="text-white block mb-2">Genres:</label>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto bg-gray-800 p-3 rounded border border-gray-600">
                {genreOptions.map(genre => (
                  <label key={genre} className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.genres.includes(genre)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, genres: [...formData.genres, genre]});
                        } else {
                          setFormData({...formData, genres: formData.genres.filter(g => g !== genre)});
                        }
                      }}
                    />
                    <span className="text-sm">{genre}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center text-white bg-[#121212]">
        <img src={logo} className="w-32" alt="Loading" />
        <p className="text-xl ml-4">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#121212] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Anime Content</h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => fetchData('series')}
            className={`px-6 py-3 rounded-l-lg font-medium transition ${
              activeTab === 'series' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Edit Series ({series.length})
          </button>
          <button
            onClick={() => fetchData('movies')}
            className={`px-6 py-3 rounded-r-lg font-medium transition ${
              activeTab === 'movies' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Edit Movies ({movies.length})
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(activeTab === 'series' ? series : movies).map((item) => (
            <div key={item._id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition">
              <img 
                src={item.cover_image} 
                alt={item.name}
                className="w-full h-48 object-cover"
                onError={(e) => e.target.src = '/placeholder.jpg'}
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate">{item.name}</h3>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.desc}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.genres?.slice(0, 3).map(genre => (
                    <span key={genre} className="bg-orange-600 text-xs px-2 py-1 rounded">
                      {genre}
                    </span>
                  ))}
                  {item.genres?.length > 3 && (
                    <span className="text-gray-400 text-xs">+{item.genres.length - 3}</span>
                  )}
                </div>
                <div className="text-sm text-gray-400 mb-3">
                  <p>Seasons: {item.nseasons}</p>
                  <p>Rating: {item.avg_rating?.toFixed(1) || 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.type, item._id, item.name)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {(activeTab === 'series' ? series : movies).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No {activeTab} found. Click the button above to load {activeTab}.
            </p>
          </div>
        )}
        
        {/* Edit Modal */}
        {editingItem && (
          <EditForm
            item={editingItem}
            type={activeTab}
            onSave={handleEdit}
            onCancel={() => setEditingItem(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Edit;