import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Template from '../../Components/Anime_list/Template/Template';

const { VITE_BACKEND_LINK } = import.meta.env;

const Series = () => {
  const [series, setSeries] = useState([]);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_LINK}/get_series`);
        setSeries(response.data.series);
      } catch (error) {
        console.error('Failed to fetch series:', error);
        setError('Failed to load series. Please try again.');
      }
    };

    fetchSeries();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-10">
        <div className="text-center mt-20">
          <p className="text-red-400 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-10">
      <h1 className="text-3xl font-bold mb-8 text-orange-400">All Series ({series.length})</h1>
      
      {series.length > 0 ? (
        <div className="grid grid-cols-4 gap-6">
          {series.map((item) => (
            <Template series={item} key={item._id} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-xl">No series available</p>
        </div>
      )}
    </div>
  );
};

export default Series;