import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Main.css";
import axios from "axios";

const { VITE_BACKEND_LINK } = import.meta.env;
const Main_Anime_2 = (props) => {
  let name = props.x.name;
  let genres =props.x.genres;
  let desc = props.x.desc;
  let files = props.x.episodes;
  let rating = props.x.avg_rating;
  const [currentRating, setCurrentRating] = useState(rating || 0);
  let [wishList, setWishList] = useState(false);
  let [rate, setRate] = useState(null);
  let [selectedRating, setSelectedRating] = useState(0);
  let [hoverRating, setHoverRating] = useState(0);
  let [showFullDescription, setShowFullDescription] = useState(false);
  let navigate = useNavigate();
  useEffect(() => {
    setCurrentRating(props.x.avg_rating || 0);
    async function ab() {
      let id2 = JSON.parse(localStorage.getItem("User"))._id;
      let rates = props.x.rating;
      let response = await axios.post(`${VITE_BACKEND_LINK}/get_wishlist`, {
        id: id2,
      });
      response = response.data;
      if (props.x.type == "s") {
        response = response.series;
      } else {
        response = response.movies;
      }
      if (response.includes(props.x._id)) setWishList(true);
      let zz = rates.find((e) => e.user == id2);
      if (zz) setRate(zz.rating);
      response = await axios.post(`${VITE_BACKEND_LINK}/get_wishlist`, {
        id: id2,
      });
      response = response.data;
      if (props.x.type == "s") response = response.series;
      else response = response.movies;
      if (response.some((k) => k._id == props.x._id)) setWishList(true);
    }
    ab();
  }, [props.x.avg_rating]);

  
  async function clearRating(e) {
    e.preventDefault();
    try {
      let type = props.x.type;
      let rid = props.x._id;
      
      const response = await axios.delete(`${VITE_BACKEND_LINK}/clear_rating/${rid}/${type}`, {
        withCredentials: true
      });
      
      const updatedAnime = await axios.get(`${VITE_BACKEND_LINK}/anime/${props.x._id}`);
      setCurrentRating(updatedAnime.data.avg_rating || 0);
      setRate(null);
      
      window.location.reload();
    } catch (error) {
      console.error('Error clearing rating:', error);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let rating = e.target.rating.value;
      if (rating != 0) {
        let id = props.x._id;
        let type = props.x.type;
        
        await axios.post(`${VITE_BACKEND_LINK}/add_series_rating`, {
          rating,
          type,
          id,
        }, {
          withCredentials: true
        });
        
        const updatedAnime = await axios.get(`${VITE_BACKEND_LINK}/anime/${props.x._id}`);
        setCurrentRating(updatedAnime.data.avg_rating || 0);
        setRate(parseInt(rating));
      } else {
        alert("Please select rating");
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  }
  async function toggleWishlist() {
    let id2 = JSON.parse(localStorage.getItem("User"))._id;
    let response = await axios.post(`${VITE_BACKEND_LINK}/toggle_wishlist`, {
      x: props.x,
      id: id2,
    });
    response = response.data.y;
    console.log(response);
    setWishList(response);
  }
  async function select_Episode(e) {
    e.preventDefault();
    if (props.x.seasons && props.x.seasons.length > 0 && props.x.seasons[0].episodes && props.x.seasons[0].episodes.length > 0) {
      const firstEpisode = props.x.seasons[0].episodes[0];
      navigate(`/episode-view/${props.x._id}/${firstEpisode._id}`);
    }
  }
  return (
    <div className="relative overflow-hidden">
      <img
        src={props.x.big_image}
        className="h-[calc(100vw*0.6625)] lg:h-[calc(100vw*0.4625)] w-screen object-cover"
        alt=""
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-12 pb-8 lg:pb-16 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 drop-shadow-2xl">
            {name}
          </h1>
          
          <div className="flex flex-wrap gap-2 lg:gap-3 mb-6">
            {genres.map((g, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm lg:text-base border border-white/30 hover:scale-105 transition-transform duration-300"
              >
                {g}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-8 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${i < Math.floor(currentRating) ? 'text-yellow-400' : 'text-gray-400/50'}`}>
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-2xl font-bold text-white">
                {currentRating.toFixed(1)}
              </span>
              <span className="text-lg text-white/80">Average Rating</span>
            </div>
            
            <div className="lg:flex hidden items-center gap-6">
              {rate ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-white/90">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < rate ? 'text-blue-400' : 'text-gray-400/50'}`}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-medium transition-all duration-300"
                    onClick={(e) => clearRating(e)}
                  >
                    Clear Rating
                  </button>
                </>
              ) : (
                <form
                  className="flex items-center gap-4"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <span className="text-white/90">Rate:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="cursor-pointer">
                        <input 
                          type="radio" 
                          name="rating" 
                          value={star} 
                          className="hidden"
                          onChange={() => setSelectedRating(star)}
                        />
                        <span 
                          className={`text-2xl transition-colors duration-200 ${
                            star <= (hoverRating || selectedRating) 
                              ? 'text-yellow-400' 
                              : 'text-gray-400/50'
                          }`}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          ⭐
                        </span>
                      </label>
                    ))}
                    <input type="radio" name="rating" value={0} defaultChecked className="hidden" />
                  </div>
                  <button className="px-4 py-2 bg-white/90 text-black rounded-lg hover:bg-white transition-all duration-300 font-medium">
                    Submit
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="text-base lg:text-lg opacity-90 mb-8 max-w-3xl leading-relaxed hidden lg:block">
            <div className={`${showFullDescription ? 'max-h-32 overflow-y-auto custom-scrollbar' : ''} transition-all duration-300`}>
              <p className={`${showFullDescription ? '' : 'line-clamp-2'}`}>
                {desc}
              </p>
            </div>
            {desc && desc.length > 150 && (
              <button 
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-400 hover:text-blue-300 mt-2 font-medium transition-colors duration-200"
              >
                {showFullDescription ? 'Read Less' : 'Read More'}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              onClick={(e) => select_Episode(e)}
            >
              <span className="text-xl">▶</span>
              <span>Watch Episode 1</span>
            </Link>
            
            {wishList ? (
              <Link
                className="flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full font-semibold transition-all duration-300 border border-white/30"
                onClick={() => toggleWishlist()}
              >
                <span className="text-xl text-black">
                  <ion-icon name="bookmark"></ion-icon>
                </span>
                <span className="hidden lg:inline">Remove from Watchlist</span>
                <span className="lg:hidden">Remove</span>
              </Link>
            ) : (
              <Link
                className="flex items-center gap-3 px-6 py-3 bg-transparent hover:bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold transition-all duration-300 border-2 border-white/50 hover:border-white"
                onClick={() => toggleWishlist()}
              >
                <span className="text-xl">
                  <ion-icon name="add-circle-outline"></ion-icon>
                </span>
                <span className="hidden lg:inline">Add to Watchlist</span>
                <span className="lg:hidden">Add</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main_Anime_2;
