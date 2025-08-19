import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Main.css";

const Main_Anime = (props) => {
  let name = props.x.name;
  const navigate = useNavigate();

  let genres = props.x.genres;
  let desc = props.x.desc;
  let seasons = props.x.seasons || []
  let totalEpisodes = seasons.reduce((total, season) => total + (season.episodes?.length || 0), 0)
  let rating = props.x.avg_rating;
  useEffect(() => {
  }, []);
  
 
  async function select_Episode(e) {
    e.preventDefault()
    navigate(`/view/${props.x._id}`)
  }

  return (
    <div className="relative w-full h-[calc(100vw*0.5625)] lg:h-[calc(100vw*0.4625)] overflow-hidden">
      <img
        src={props.x.big_image}
        className="absolute inset-0 w-full h-full object-cover"
        alt={name}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      
      <div className="relative z-10 h-full flex items-center px-6 lg:px-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 text-white drop-shadow-2xl">{name}</h1>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {genres.map((genre, index) => (
              <span key={index} className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white border border-white/30">
                {genre}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <ion-icon key={i} name={i < Math.floor(rating) ? "star" : "star-outline"} class="text-lg"></ion-icon>
                ))}
              </div>
              <span className="text-white font-semibold">{rating.toFixed(1)}</span>
            </div>
            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
            <span className="text-white/80">{seasons.length} Season{seasons.length !== 1 ? 's' : ''}</span>
          </div>
          
          <p className="text-white/90 text-lg leading-relaxed mb-8 line-clamp-3">{desc}</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={select_Episode}
              className="group flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/25"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <ion-icon name="play" class="text-xl ml-1"></ion-icon>
              </div>
              Watch Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main_Anime;
