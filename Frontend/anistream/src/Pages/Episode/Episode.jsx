import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
const {VITE_BACKEND_LINK}=import.meta.env
const Episode = () => {
  const { animeId, episodeId } = useParams();
  const navigate = useNavigate();

  const [animeData, setAnimeData] = useState(null)
  const [currentEpisode, setCurrentEpisode] = useState(null)
  const [allEpisodes, setAllEpisodes] = useState([])
  const [title, setTitle] = useState('')
  const [views, setViews] = useState('')
  const [iframeCode, setIframeCode] = useState('')
  const [reviews, setReviews] = useState([])
  const [likes, setLikes] = useState([])
  const [dislikes, setDislikes] = useState([])
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnimeAndEpisode()
  }, [animeId, episodeId])

  const fetchAnimeAndEpisode = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${VITE_BACKEND_LINK}/anime/${animeId}`)
      const anime = response.data
      setAnimeData(anime)
      
      // Flatten all episodes
      let episodes = []
      anime.seasons.forEach(season => {
        episodes.push(...season.episodes)
      })
      setAllEpisodes(episodes)
      
      // Find current episode
      const episode = episodes.find(ep => ep._id === episodeId)
      if (episode) {
        setCurrentEpisode(episode)
        await fetchEpisodeDetails(episode.file_code)
        await fetchReviews(episode._id)
      }
      
      setIsLoading(false)
    } catch (error) {
      console.log('Failed to fetch anime/episode:', error)
      setIsLoading(false)
    }
  }
  
  const fetchEpisodeDetails = async (fileCode) => {
    try {
      const response = await axios.get(`https://api.streamwish.com/api/file/info?key=11124m28yb5z5qbkuh1ru&file_code=${fileCode}`)
      setViews(response.data.result[0].file_views)
      setTitle(response.data.result[0].file_title)
      setIframeCode(`<IFRAME SRC="https://hglink.to/e/${fileCode}" FRAMEBORDER=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=NO WIDTH=100% HEIGHT=100% allowfullscreen style="width:100%;height:100%;"></IFRAME>`)
    } catch (error) {
      console.log('Failed to fetch episode details:', error)
    }
  }
  
  const fetchReviews = async (episodeId) => {
    try {
      const response = await axios.get(`${VITE_BACKEND_LINK}/get_reviews/${episodeId}`)
      setReviews(response.data.reviews || [])
      setLikes(response.data.likes || [])
      setDislikes(response.data.dislikes || [])
      
      const userId = JSON.parse(localStorage.getItem('User'))?._id
      setUserLiked(response.data.likes?.includes(userId) || false)
      setUserDisliked(response.data.dislikes?.includes(userId) || false)
    } catch (error) {
      console.log('Failed to fetch reviews:', error)
    }
  }
  
  
  const changeEpisode = (episode) => {
    navigate(`/episode-view/${animeId}/${episode._id}`)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${VITE_BACKEND_LINK}/add_review`, {
        name: e.target.name.value,
        comment: e.target.comment.value,
        id: currentEpisode._id
      });
      await fetchReviews(currentEpisode._id)
      e.target.name.value = ""
      e.target.comment.value = ""
    } catch (error) {
      console.log('Failed to add review:', error)
    }
  }
  
  const toggle = async (preop, op) => {
    try {
      const uid = JSON.parse(localStorage.getItem('User'))?._id
      await axios.get(`${VITE_BACKEND_LINK}/toggle/${preop}/${op}/${currentEpisode._id}/${uid}`)
      await fetchReviews(currentEpisode._id)
    } catch (error) {
      console.log('Failed to toggle like/dislike:', error)
    }
  }
  
  const deleteReview = async (reviewId) => {
    try {
      await axios.post(`${VITE_BACKEND_LINK}/delete_review`, {
        id: currentEpisode._id,
        did: reviewId
      })
      await fetchReviews(currentEpisode._id)
    } catch (error) {
      console.log('Failed to delete review:', error)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="ml-4 text-xl">Loading episode...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">
              {iframeCode && (
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="aspect-video" dangerouslySetInnerHTML={{ __html: iframeCode }}>
                  </div>
                  <div className="p-6">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-3">{title}</h1>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-400">{views} views</p>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => toggle('dislikes', 'likes')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-gray-700 ${
                            userLiked ? 'text-orange-500 bg-gray-700' : 'text-gray-300'
                          }`}
                        >
                          <ion-icon name="thumbs-up"></ion-icon>
                          <span>{likes.length}</span>
                        </button>
                        <button
                          onClick={() => toggle('likes', 'dislikes')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-gray-700 ${
                            userDisliked ? 'text-red-500 bg-gray-700' : 'text-gray-300'
                          }`}
                        >
                          <ion-icon name="thumbs-down"></ion-icon>
                          <span>{dislikes.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <ion-icon name="chatbubbles"></ion-icon>
                  Comments ({reviews.length})
                </h3>
                
                <form onSubmit={handleSubmit} className="mb-6">
                  <input type="hidden" name="name" value={JSON.parse(localStorage.getItem('User')).username} />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="comment"
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </form>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((comment, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-orange-400">{comment.name}</span>
                        {comment.name === JSON.parse(localStorage.getItem('User'))?.username && (
                          <button
                            onClick={() => deleteReview(comment._id)}
                            className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-gray-200">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {allEpisodes.length > 1 && (
              <div className="xl:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ion-icon name="play-circle"></ion-icon>
                    Episodes
                  </h2>
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {allEpisodes.map((episode, i) => (
                      <button
                        key={episode._id}
                        onClick={() => changeEpisode(episode)}
                        className={`w-full group relative overflow-hidden rounded-lg transition-transform hover:scale-105 ${
                          episode._id === episodeId ? 'ring-2 ring-orange-500' : ''
                        }`}
                      >
                        <img
                          src={episode.snap_link}
                          alt={`Episode ${i + 1}`}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                          <span className="text-white font-semibold">Episode {i + 1}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Episode;