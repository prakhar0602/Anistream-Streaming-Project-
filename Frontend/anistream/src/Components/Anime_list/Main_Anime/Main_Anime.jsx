import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Main.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {select,  set_local_data1,  update_selected,} from "../../../Redux/local_data_Slice";
import { set_Episode } from "../../../Redux/episodeSlice";
const {VITE_BACKEND_LINK}=import.meta.env
const Main_Anime = (props) => {
  let name = props.x.name;
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let genres = ["Action", "Adventure", "Drama"];
  let desc = props.x.desc;
  let files=props.x.episodes
  let rating = props.x.avg_rating;
  let fld_id=props.x.fld_id
  let [rate, setRate] = useState(null);
  useEffect(() => {
    let id2 = JSON.parse(localStorage.getItem("User"))._id;
    let rates = props.x.rating;
    console.log(props.x);
    let zz = rates.find((e) => e.user == id2);
    if (zz) setRate(zz.rating);
  }, []);
  async function clearRating(e) {
    e.preventDefault();
    console.log(props.x.rating);
    let id2 = JSON.parse(localStorage.getItem("User"))._id;
    let rates = props.x.rating;
    let zz = rates.find((e) => e.user == id2);
    let type = props.x.type;
    let id3 = zz._id;
    let rid = props.x._id;
    let response = await axios.get(
      `${VITE_BACKEND_LINK}/del_rating/${id3}/${rid}/${type}`
    );
    await dispatch(update_selected({ id: rid, type }));
    setRate(null);
    await dispatch(set_local_data1());
  }
  async function handleSubmit(e) {
    e.preventDefault();
    let uid = JSON.parse(localStorage.getItem("User"))._id;
    let r = props.x.rating;
    let check = r.some((x) => x["user"] == uid);
    if (!check) {
      let rating = e.target.rating.value;
      if (rating != 0) {
        let id = props.x._id;
        let type = props.x.type;
        await axios.post(`${VITE_BACKEND_LINK}/add_series_rating`, {
          rating,
          type,
          uid,
          id,
        });
        await dispatch(update_selected({ id, type }));
        setRate(rating);
        await dispatch(set_local_data1());
      } else {
        alert("Please select rating");
      }
    } else {
      alert("rating already given");
    }
  }
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
      <div className="h-[calc(100vw*0.5625)] lg:h-[calc(100vw*0.4625)] bg-black/60 relative -mt-[calc(100vw*0.5625)] lg:-mt-[calc(100vw*0.4625)] z-10"></div>
      <div className="flex flex-col px-10 text-white relative h-[calc(100vw*0.5625)] lg:h-[calc(100vw*0.4625)] lg:-mt-[calc(100vw*0.4625)] -mt-[calc(100vw*0.5625)]  justify-center z-20">
        <h2 className="xl:text-6xl lg:text-3xl text-md font-bold font-mono">{name}</h2>
        <div className="flex lg:gap-10 gap-7 lg:my-5 my-2">
          {genres.map((g, index) => (
            <div className="genre">{g}</div>
          ))}
        </div>
        <p className="lg:my-3 my-2 lg:text-xl text-sm">{rating.toFixed(1)} Average Rating</p>
        <p className="hidden lg:block">{desc}</p>
        <div className="hidden lg:flex">
        {rate ? (
          <div className="lg:my-6 my-3 flex items-center lg:gap-8 gap-4">
            <p class="starability-result" data-rating={rate}>
              Rated: {rate} stars
            </p>
            <button
              className="bg-purple-800 p-2 rounded-lg hover:bg-purple-950 h-14"
              onClick={(e) => clearRating(e)}
            >
              Clear Rating
            </button>
          </div>
        ) : (
          <div className="lg:my-4 my-2">
            <form
              className="flex lg:gap-14 gap-7 justify-left items-center"
              onSubmit={(e) => handleSubmit(e)}
            >
              <fieldset className="starability-basic mt-5">
                <input
                  type="radio"
                  id="no-rate"
                  class="input-no-rate"
                  name="rating"
                  value={0}
                  defaultChecked
                  aria-label="No rating."
                />
                <input type="radio" id="second-rate1" name="rating" value={1} />
                <label className="" for="second-rate1" title="Terrible">
                  1 star
                </label>
                <input type="radio" id="second-rate2" name="rating" value={2} />
                <label for="second-rate2" title="Not good">
                  2 stars
                </label>
                <input type="radio" id="second-rate3" name="rating" value={3} />
                <label for="second-rate3" title="Average">
                  3 stars
                </label>
                <input type="radio" id="second-rate4" name="rating" value={4} />
                <label for="second-rate4" title="Very good">
                  4 stars
                </label>
                <input type="radio" id="second-rate5" name="rating" value={5} />
                <label for="second-rate5" title="Amazing">
                  5 stars
                </label>
              </fieldset>

              <button className="bg-purple-800 p-2 rounded-lg hover:bg-purple-950 h-14">
                Submit Rating
              </button>
            </form>
          </div>
        )}
        </div>
        <div className="flex mt-3 lg:mt-5">
          <button
            className="hover:bg-gradient-to-r text-sm text-white from-[#be51ca] to-[#753eb9] inline mr-2 lg:ml-3 py-2.5 px-4 rounded-3xl bg-gradient-to-r hover:from-[#a448ae] hover:to-[#5c3290]"
            onClick={(e) => select_Episode(e, 0)}
          >
            Watch Episode 1
          </button>
          <Link
            className="hover:bg-gradient-to-r text-white from-[#be51ca] to-[#753eb9] inline mr-2 ml-3 py-2.5 px-4 rounded-3xl bg-gradient-to-r hover:from-[#a448ae] hover:to-[#5c3290]"
            onClick={(e)=>setAnime(e)}
          >
            All Episodes
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main_Anime;
