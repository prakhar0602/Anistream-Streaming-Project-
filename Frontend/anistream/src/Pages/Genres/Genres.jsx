import React, { useEffect, useState } from 'react'
import { check_user } from '../../Redux/userSlice'
import { useNavigate, useParams } from 'react-router-dom'
import Genre from '../../Components/Genre_Template/Genre'
import Template from '../../Components/Anime_list/Template/Template'
import Loading from '../Loading'
import axios from 'axios'

const Genres = () => {
  const navigate = useNavigate()
  const { genre: urlGenre } = useParams()
  const [genres] = useState(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Mystery'])
  const selectedGenre = urlGenre || null
  const [animeData, setAnimeData] = useState({ series: [], movies: [] })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      if (!await check_user())
        navigate('/login')
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (urlGenre) {
      fetchAnimeByGenre(urlGenre)
    }
  }, [urlGenre])



  const handleGenreClick = async (genre) => {
    setIsLoading(true)
    navigate(`/genres/${encodeURIComponent(genre)}`)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const fetchAnimeByGenre = async (genre) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_LINK}/genre/${encodeURIComponent(genre)}`)
      setAnimeData(response.data)
    } catch (error) {
      console.error('Error fetching anime by genre:', error)
    }
    setTimeout(() => setIsLoading(false), 2000)
  }

  const getGenreImage = (genre) => {
    const images = {
      'Action': 'https://res.cloudinary.com/jerrick/image/upload/c_scale,f_jpg,q_auto/lgi39qi7kmzdipemivm1.jpg',
      'Adventure': 'https://static.toiimg.com/thumb/msid-108812406,width-1280,height-720,resizemode-4/108812406.jpg',
      'Comedy': 'https://cms.animecollective.com/wp-content/uploads/2023/04/best-comedy-anime-sket-dance.jpg',
      'Drama': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlH0Ymm-2VpaEo_7DM7GAm2OU9IRDUqPbszQ&s',
      'Fantasy': 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/the-greatest-fantasy-anime-of-all-time-december-2024.jpg?q=70&fit=contain&w=1200&h=628&dpr=1',
      'Horror': 'https://i.ytimg.com/vi/R49kY-dsALA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBARvbksdPrt2bM6owMWKY7-zh-RQ',
      'Romance': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYmjRVWD6dtVb_jmZpU_UQOpCCFl7suwMsGA&s',
      'Sci-Fi': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs7Ej1Q5aTe9BtZxeHko-BDB3DAoyEs2VQ2Q&s',
      'Thriller': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0MyLJF0VK-YnnyqnjuppAQNzn8WqmUovxeQ&s',
      'Mystery': 'https://assets.telegraphindia.com/telegraph/2025/Jun/1751094655_lord-of-mysteries.jpg'
    }
    return images[genre] || 'https://images.unsplash.com/photo-1489599162810-1e666c4b8e8e?w=400'
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className="min-h-screen bg-[#0F1419] p-4">
      {!urlGenre ? (
        <div>
          <h1 className="text-white text-3xl font-bold mb-8 text-center">Browse by Genre</h1>
          <div className="grid grid-cols-3 gap-4 max-w-6xl mx-auto">
            {genres.map((genre, index) => (
              <Genre
                key={index}
                title={genre}
                image={getGenreImage(genre)}
                onClick={handleGenreClick}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/genres')}
              className="text-white bg-gray-700 px-4 py-2 rounded mr-4 hover:bg-gray-600"
            >
              ← Back to Genres
            </button>
            <h1 className="text-white text-3xl font-bold">{urlGenre} Anime</h1>
          </div>
          
          {animeData.series.length > 0 && (
            <div className="mb-8">
              <h2 className="text-white text-2xl font-semibold mb-4">Series</h2>
              <div className="flex flex-wrap gap-4">
                {animeData.series.map((anime) => (
                  <Template key={anime._id} series={anime} />
                ))}
              </div>
            </div>
          )}
          
          {animeData.movies.length > 0 && (
            <div>
              <h2 className="text-white text-2xl font-semibold mb-4">Movies</h2>
              <div className="flex flex-wrap gap-4">
                {animeData.movies.map((anime) => (
                  <Template key={anime._id} series={anime} />
                ))}
              </div>
            </div>
          )}
          
          {animeData.series.length === 0 && animeData.movies.length === 0 && (
            <div className="text-white text-center text-xl mt-8">
              No anime found for {urlGenre} genre
            </div>
          )}
        </div>
      )}
      </div>
    </>
  )
}

export default Genres