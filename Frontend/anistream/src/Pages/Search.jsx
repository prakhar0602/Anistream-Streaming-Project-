import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Template from '../Components/Anime_list/Template/Template';

const { VITE_BACKEND_LINK } = import.meta.env;

const Search = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [series, setSeries] = useState([]);
  const [movies, setMovies] = useState([]);

  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSeries([]);
      setMovies([]);
      setError('');
      setHasSearched(false);
      return;
    }
    
    setError('');
    setHasSearched(true);
    
    try {
      const response = await axios.get(`${VITE_BACKEND_LINK}/search/${encodeURIComponent(searchQuery.trim())}`);
      
      if (response.data.bool) {
        setSeries(response.data.results.series || []);
        setMovies(response.data.results.movies || []);
      } else {
        setError(response.data.message || 'Search failed');
        setSeries([]);
        setMovies([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError('Search failed. Please try again.');
      setSeries([]);
      setMovies([]);
    }
  };

  // Get search suggestions
  const getSuggestions = async (searchQuery) => {
    if (searchQuery.trim().length < 1) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await axios.get(`${VITE_BACKEND_LINK}/search/${encodeURIComponent(searchQuery.trim())}`);
      if (response.data.bool) {
        const allResults = [...response.data.results.series, ...response.data.results.movies];
        const uniqueNames = [...new Set(allResults.map(item => item.name))].slice(0, 5);
        setSuggestions(uniqueNames);
      }
    } catch (error) {
      setSuggestions([]);
    }
  };

  // Handle URL query parameter and debounced search
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      performSearch(urlQuery);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 1) {
        getSuggestions(query);
        performSearch(query);
      } else if (query.trim().length === 0) {
        setSeries([]);
        setMovies([]);
        setError('');
        setHasSearched(false);
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    performSearch(query);
  };

  return (
    <div className="p-10 min-h-screen bg-[#121212] text-white">
      {/* Search Box */}
      <div className="relative max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-[#1f1f1f] border border-gray-600 rounded-lg px-4 py-2"
        >
          <input
            type="text"
            placeholder="Search anime..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-xl"
            autoFocus
          />
          <button
            type="submit"
            className="ml-2 text-white hover:text-orange-500 transition text-2xl"
          >
            🔍
          </button>
        </form>
        
        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-[#1f1f1f] border border-gray-600 rounded-b-lg mt-1 z-10">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2 text-white hover:bg-[#2a2a2a] transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Results */}
      <div className="mt-10">
        <div className="mt-10">
          {/* Series */}
          {series.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">Series</h2>
              <div className="flex flex-wrap gap-6">
                {series.map((item) => (
                  <Template series={item} key={item._id} />
                ))}
              </div>
            </div>
          )}

          {/* Movies */}
          {movies.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-orange-400">Movies</h2>
              <div className="flex flex-wrap gap-6">
                {movies.map((item) => (
                  <Template series={item} key={item._id} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {hasSearched && series.length === 0 && movies.length === 0 && !error && (
            <div className="text-center mt-10">
              <p className="text-gray-400 text-lg mb-2">No results found for "{query}"</p>
              <p className="text-gray-500 text-sm">Try searching with different keywords</p>
            </div>
          )}
          
          {/* Search Results Count */}
          {hasSearched && (series.length > 0 || movies.length > 0) && (
            <div className="text-center mt-6 mb-8">
              <p className="text-gray-300">
                Found {series.length + movies.length} result{series.length + movies.length !== 1 ? 's' : ''} for "{query}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
