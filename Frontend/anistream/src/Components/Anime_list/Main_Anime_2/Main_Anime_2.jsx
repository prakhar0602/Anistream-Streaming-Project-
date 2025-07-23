import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Main.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  set_local_data1,
  update_selected,
} from "../../../Redux/local_data_Slice";
import { set_Episode } from "../../../Redux/episodeSlice";
const { VITE_BACKEND_LINK } = import.meta.env;
const Main_Anime_2 = (props) => {
  let name = props.x.name;
  let dispatch = useDispatch();
  let genres = ["Action", "Adventure", "Drama"];
  let desc = props.x.desc;
  let files = props.x.episodes;
  let rating = props.x.avg_rating;
  let [wishList, setWishList] = useState(false);
  let [rate, setRate] = useState(null);
  let navigate = useNavigate();
  useEffect(() => {
    async function ab() {
      let id2 = JSON.parse(localStorage.getItem("User"))._id;
      let rates = props.x.rating;
      let response = await axios.post(`${VITE_BACKEND_LINK}/get_wishlist`, {
        id: id2,
      });
      response = response.data;
      // console.log(response)
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
      console.log(props.x._id);
      console.log(response);
      if (response.some((k) => k._id == props.x._id)) setWishList(true);
    }
    ab();
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
    let a = {
      index: 0,
      files,
    };
    console.log(a);
    dispatch(set_Episode(a));
    navigate("/episode-view");
  }
  return (
    <div>
      <img
        src={props.x.big_image}
        className="h-[calc(100vw*0.6625)] lg:h-[calc(100vw*0.4625)]  z-0 w-screen"
        alt=""
      />
      <div className="h-[calc(100vw*0.6625)] lg:h-[calc(100vw*0.4625)] bg-black/60 relative lg:-mt-[calc(100vw*0.4625)] -mt-[calc(100vw*0.6625)] z-10"></div>
      <div className="flex flex-col px-10 text-white relative h-[calc(100vw*0.6625)] lg:h-[calc(100vw*0.4625)] -mt-[calc(100vw*0.6625)] lg:-mt-[calc(100vw*0.4625)] justify-center lg:gap-4 z-20">
        <h2 className="xl:text-6xl text-3xl font-bold font-mono">{name}</h2>
        <div className="flex lg:gap-3 gap-3 lg:my-5 mt-1 lg:mt-0">
          {genres.map((g, index) => (
            <div className="flex genre gap-3">
              <p>
                {g}
                </p>
                {
                  genres.length-1==index?(
                    <div></div>
                  ):(
                  <div className="w-[1px] bg-[#ffffff] h-full"></div>
                )}
              </div>
            
          ))}
        </div>
        <div className="flex items-center gap-8">
          <p className="  lg:text-xl text-lg mt-1 lg:mt-0 p-0 mb-0">
            {rating.toFixed(1)} Average Rating{" "}
          </p>
          <div className="w-[1px] bg-[#ffffff] h-full"></div>
          <div className="lg:inline hidden h-fit">
            {rate ? (
              <div className="flex items-center gap-8">
                <p class="starability-result" data-rating={rate}>
                  Rated: {rate} stars
                </p>
                <button
                  className="p-2 rounded-lg bg-gradient-to-r from-[#5b2020] hover:from-[#230000] hover:to-[#230000] to-[#230000] "
                  onClick={(e) => clearRating(e)}
                >
                  Clear Rating
                </button>
              </div>
            ) : (
              <div className="">
                <form
                  className="flex gap-14 justify-left items-center"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <fieldset className="flex starability-basic ">
                    <input
                      type="radio"
                      id="no-rate"
                      class="input-no-rate"
                      name="rating"
                      value={0}
                      defaultChecked
                      aria-label="No rating."
                    />
                    <input
                      type="radio"
                      id="second-rate1"
                      name="rating"
                      value={1}
                    />
                    <label for="second-rate1" title="Terrible">
                      1 star
                    </label>
                    <input
                      type="radio"
                      id="second-rate2"
                      name="rating"
                      value={2}
                    />
                    <label for="second-rate2" title="Not good">
                      2 stars
                    </label>
                    <input
                      type="radio"
                      id="second-rate3"
                      name="rating"
                      value={3}
                    />
                    <label for="second-rate3" title="Average">
                      3 stars
                    </label>
                    <input
                      type="radio"
                      id="second-rate4"
                      name="rating"
                      value={4}
                    />
                    <label for="second-rate4" title="Very good">
                      4 stars
                    </label>
                    <input
                      type="radio"
                      id="second-rate5"
                      name="rating"
                      value={5}
                    />
                    <label for="second-rate5" title="Amazing">
                      5 stars
                    </label>
                  </fieldset>

                  <button className="bg-[#fff] text-black p-2 rounded-lg">
                    Submit Rating
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
        <p className={`lg:block hidden`}>{desc}</p>

        <div className="flex justify-left mt-3 lg:mt-0">
          <Link
            className=" text-black h-12 flex justify-center items-center gap-2 mr-2 ml-3 py-2.5 px-4 rounded-3xl bg-[#fff]"
            onClick={(e) => select_Episode(e)}
          >
            Watch Episode 1
          </Link>
          {wishList ? (
            <Link
              className=" text-black flex h-12 justify-center items-center gap-2 mr-2 ml-3 py-2.5 px-4 rounded-3xl  bg-[#fff]"
              onClick={() => toggleWishlist()}
            >
              <span
                className={
                  "lg:text-2xl h-fit text-xl m-0 flex items-center text-[#fff]"
                }
              >
                <ion-icon className="h-fit" name="bookmark"></ion-icon>
              </span>
              <span className="text-lg inline">Remove from WatchList</span>
            </Link>
          ) : (
            <Link
              className=" text-[#fff] flex justify-center items-center gap-2 mr-2 ml-3 py-2.5 px-4 rounded-3xl  border-[3px] border-[#fff]"
              onClick={() => toggleWishlist()}
            >
              <span
                className={
                  "lg:text-2xl text-xl m-0 h-fit flex items-center text-[#fff]"
                }
              >
                <ion-icon name="add-circle-outline"></ion-icon>
              </span>
              <span className="hidden text-lg lg:inline">Add to WatchList</span>
              <span className="flex lg:hidden m-0 items-center h-fit">
                WatchList
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main_Anime_2;
