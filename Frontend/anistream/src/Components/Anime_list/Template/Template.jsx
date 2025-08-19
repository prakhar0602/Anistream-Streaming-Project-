import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import './template.css'
const {VITE_BACKEND_LINK} = import.meta.env;
const Template = (props) => {
  let name = props.series.name;
  let image = props.series.cover_image;
  let image2 = props.series.cover_image2;
  let avg_rating = props.series.avg_rating;
  let description = props.series.desc;
  const [hovered, setHovered] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkWishlistStatus();
  }, []);
  
  async function checkWishlistStatus() {
    try {
      const userId = JSON.parse(localStorage.getItem("User"))?._id;
      if (!userId) return;
      
      const response = await axios.post(`${VITE_BACKEND_LINK}/get_wishlist`, {
        id: userId,
      });
      
      const wishlistData = response.data;
      const relevantList = props.series.type === "s" ? wishlistData.series : wishlistData.movies;
      setInWishlist(relevantList.some(item => item._id === props.series._id));
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  }
  
  async function toggleWishlist() {
    try {
      const userId = JSON.parse(localStorage.getItem("User"))?._id;
      if (!userId) return;
      
      const response = await axios.post(`${VITE_BACKEND_LINK}/toggle_wishlist`, {
        x: props.series,
        id: userId,
      });
      
      setInWishlist(response.data.y);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  }
  
  function goTo(){
    navigate(`/view/${props.series._id}`)
  }
  return (
    <div
      className="w-[163px] h-[217px] flex-shrink-0 hover:w-[20vw] hover:h-[50vh] transition-all duration-500 ease-in-out bg-[#16181F]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? (
        <div className="flex flex-col gap-2 h-full w-full">
          <img src={image2} className="w-full h-full" />
          <div className="h-full w-full">
            <div className="flex gap-2 h-[40%] w-full p-2">
              <button className="bg-white h-full rounded-lg w-full flex justify-center items-center" onClick={()=>goTo()}>
                <div className="flex gap-2 justify-center items-center text-black">
                  <p className="flex ">
                    <ion-icon name="play"></ion-icon>
                  </p>
                  <p>Watch Now</p>
                </div>
              </button>
              <button 
                className={`flex h-full aspect-square justify-center items-center rounded-md transition-colors duration-200 ${
                  inWishlist ? 'bg-green-600 hover:bg-green-700' : 'bg-[#575757] hover:bg-[#666666]'
                }`}
                onClick={toggleWishlist}
              >
                <p className="text-white flex">
                  <ion-icon name={inWishlist ? "checkmark" : "add"}></ion-icon>
                </p>
              </button>
            </div>
            <div className="flex gap-2 text-white p-2">
              <div className="flex gap-1">
                <p>
                  <ion-icon name="star"></ion-icon>
                </p>
                <p>{avg_rating}</p>
              </div>
              <div className="flex justify-center items-center gap-1">
                <p className="w-fit h-fit">
                  <ion-icon name="radio-button-on"></ion-icon>
                </p>
                <p className="w-fit h-fit">Japanese</p>
              </div>
            </div>
            <div className="w-full max-h-full text-white p-2 ">
              <p className="text-ellipsis line-clamp-2 ">{description}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className=" flex flex-col w-full h-full">
          <img src={image} className="w-full h-full object-cover object-center " />
        </div>
      )}
    </div>
  );
};

export default Template;
