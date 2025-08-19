import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Template from '../../Components/Anime_list/Template/Template';

const { VITE_BACKEND_LINK } = import.meta.env;

const Movies = () => {
  const [movies, setMovies] = useState([]);

  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${VITE_BACKEND_LINK}/get_movies`);
        setMovies(response.data.movies);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        setError('Failed to load movies. Please try again.');
      }
    };

    fetchMovies();
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
      <h1 className="text-3xl font-bold mb-8 text-orange-400">All Movies ({movies.length})</h1>
      
      {movies.length > 0 ? (
        <div className="flex flex-wrap gap-6">
          {movies.map((item) => (
            <Template series={item} key={item._id} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-xl">No movies available</p>
        </div>
      )}
    </div>
  );
};

export default Movies;