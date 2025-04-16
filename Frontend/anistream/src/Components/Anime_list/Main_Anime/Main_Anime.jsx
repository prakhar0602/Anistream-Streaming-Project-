import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Main.css";
import { useDispatch} from "react-redux";
import {select} from "../../../Redux/local_data_Slice";
import { set_Episode } from "../../../Redux/episodeSlice";
const Main_Anime = (props) => {
  let name = props.x.name;
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let genres = ["Action", "Adventure", "Drama"];
  let desc = props.x.desc;
  let files=props.x.episodes
  let rating = props.x.avg_rating;
  useEffect(() => {
  }, []);
  
 
  async function select_Episode(e) {
    e.preventDefault()
    let a={
      index:0,
      files,
    }
    console.log(a)
    dispatch(set_Episode(a));
    navigate('/episode-view')
  }
  async function setAnime(e){
    e.preventDefault()
    let x=props.x;
    await dispatch(select(x))
    navigate('/view')
  }
  return (
    <div className="">
      <img
        src={props.x.big_image}
        className="h-[calc(100vw*0.5625)] lg:h-[calc(100vw*0.4625)] z-0 w-screen"
        alt=""
      />
      <div className="h-[calc(100vw*0.5625)] lg:h-[calc(100vw*0.4625)] bg-black/0 relative -mt-[calc(100vw*0.5625)] lg:-mt-[calc(100vw*0.4625)] z-10"></div>
      <div className="flex flex-col px-10 text-white relative h-[calc(100vw*0.5625)] lg:h-[calc(100vw*0.4625)] lg:-mt-[calc(100vw*0.4625)] -mt-[calc(100vw*0.5625)]  justify-center z-20">
        <h2 className="xl:text-6xl lg:text-3xl text-md font-bold font-mono">{name}</h2>
        <div className="flex lg:gap-10 gap-7 lg:my-5 my-2">
          {genres.map((g, index) => (
            <div className="genre">{g}</div>
          ))}
        </div>
        <p className="lg:my-3 my-2 lg:text-xl text-sm">{rating.toFixed(1)} Average Rating</p>
        <p className="hidden lg:block w-[50%]">{desc}</p>
        <div className="flex mt-3 lg:mt-5">
          <button
            className="text-sm flex gap-2 justify-center items-center text-white bg-gradient-to-r from-[#5b2020] hover:from-[#230000] hover:to-[#230000] to-[#230000] mr-2 lg:ml-3 py-2.5 px-4 rounded-3xl "
            onClick={(e) => select_Episode(e, 0)}
          >
            <p className="flex justify-cente text-lg items-center text-white p-1 border-white border-[1px] rounded-full m-0 w-fit h-fit"><ion-icon name="play"></ion-icon></p>
            Watch Now
          </button>
          <Link
            className=" text-white flex justify-center items-center gap-2 mr-2 ml-3 py-2.5 px-4 rounded-3xl bg-gradient-to-r from-[#5b2020] hover:from-[#230000] hover:to-[#230000] to-[#230000]"
            onClick={(e)=>setAnime(e)}
          >
            <p className="flex justify-cente text-lg items-center text-white p-1 border-white border-[1px] rounded-full m-0 w-fit h-fit"><ion-icon name="arrow-forward"></ion-icon></p>
            All Episodes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main_Anime;
