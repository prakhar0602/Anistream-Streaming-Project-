import React, { useState } from "react";
import axios from 'axios';

const Form = (props) => {
  const name=props.name;
  const {VITE_BACKEND_LINK}=import.meta.env
//   const fld_id=props.fld_id
  const big_image       = props.big_image;
  const cover_image     = props.cover_image;
  const desc            = props.desc;
  const nepisodes       = props.nepisodes;
  const nseasons        = props.nseasons;
  const setBigImage     = props.setBigImage;
  const setCoverImage   = props.setCoverImage;
  const setDesc         = props.setDesc;
  const setEpisodes     = props.setEpisodes;
  const setSeasons      = props.setSeasons;
  const type            = props.type;
  const setType         = props.setType;
  const setMessage      = props.setMessage;
  const user            = props.user;
  const setLoading      = props.setLoading;

  function handleBImage(event) {
    setBigImage(event.target.value);
  }
  function handleCImage(event) {
    setCoverImage(event.target.value);
  }
  function handleDesc(event) {
    setDesc(event.target.value);
  }
  function changeepisodes(event) {
    setEpisodes(event.target.value);
  }
  function changeSeasons(event) {
    setSeasons(event.target.value);
  }

  async function handleSubmit(event) {
    console.log(user)
    event.preventDefault();
    if(user.type!='admin'){
      toast.warning('Request Rejected',{
        position:'top-center'
      })
      return
    }
    setLoading(true)

    // Upload data on custom Server
    let formData = new FormData();
    formData.append("name", name);
    formData.append("big_image", big_image);
    formData.append("cover_image", cover_image);
    formData.append("desc", desc);
    formData.append("nseasons", nseasons);
    formData.append("nepisodes", nepisodes);
    formData.append("fld_id", localStorage.getItem("fld_id"));
    formData.append("type", type);
    let encoded = new URLSearchParams(formData).toString();
    console.log(encoded);
    try {
      let response = await axios.post(
        `${VITE_BACKEND_LINK}/add_anime`,
        encoded,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setMessage(response.data.data);
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("fld_id");
    setLoading(false)
  }

  return (
    <div className="flex">
      <form
        className="flex flex-col gap-14 w-fit justify-center items-center"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="flex gap-24">
        <div className="flex flex-col gap-5">
        <div className="flex w-full justify-between items-center">
          <label className="text-white font-mono text-[18px]" htmlFor="name">
            Name Of Series
          </label>
          <input
            className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
            type="text"
            id="name"
            name="name"
            value={name}
            disabled
          />
        </div>
        <div className="flex w-full justify-between items-center">
          <label
            className="text-white font-mono text-[18px]"
            htmlFor="big_image"
          >
            Big Image
          </label>
          <input
            className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
            type="text"
            id="big_image"
            name="big_image"
            onChange={handleBImage}
            value={big_image}
          />
        </div>
        <div className="flex w-full justify-between items-center">
          <label
            className="text-white font-mono text-[18px]"
            htmlFor="cover_image"
          >
            Cover Image
          </label>
          <input
            type="text"
            className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
            id="cover_image"
            name="cover_image"
            onChange={handleCImage}
            value={cover_image}
          />
        </div>
        <div className="flex w-full justify-between items-center">
          <label className="text-white font-mono text-[18px]" htmlFor="desc">
            Description
          </label>
          <input
            type="text"
            className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
            id="desc"
            name="desc"
            onChange={handleDesc}
            value={desc}
          />
        </div>
        </div>
        <div className="flex flex-col gap-5">
        <div className="flex w-full justify-between items-center">
          <label className="text-white font-mono text-[18px]" htmlFor="fld_id">
            Folder ID
          </label>
          <input
            type="text"
            className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
            id="fld_id"
            name="fld_id"
            value={localStorage.getItem("fld_id")}
            disabled
            />
        </div>
        <div className="flex w-full justify-between items-center">
          <label
            className="text-white font-mono text-[18px]"
            htmlFor="nepisodes"
            >
            Episodes
          </label>
          <input
            type="text"
            className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
            id="nepisodes"
            name="nepisodes"
            onChange={(e) => changeepisodes(e)}
            value={nepisodes}
            />
        </div>
        <div className="flex w-full justify-between items-center">
          <label
            className="text-white font-mono text-[18px]"
            htmlFor="nseasons"
            >
            Seasons
          </label>
          <input
            type="text"
            className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
            id="nseasons"
            name="nseasons"
            onChange={(e) => changeSeasons(e)}
            value={nseasons}
            />
        </div>
        <div className="flex w-full justify-between items-center">
          <legend className="text-white font-mono text-[18px]">Type</legend>
          <div className="flex gap-[110px]">
            <div className="text-white flex gap-[15px] text-[18px] font-sans">
              <label
                className="text-white font-mono text-[18px]"
                htmlFor="movie"
                >
                Movies
              </label>
              <input
                type="radio"
                className="scale-150"
                id="movie"
                name="type"
                value="movies"
                onChange={()=>setType("movies")}
                checked={type=="movies"}
                />
            </div>
            <div className="text-white flex gap-[15px] text-[18px] font-sans">
              <label
                className="text-white font-mono text-[18px]"
                htmlFor="series"
                >
                Series
              </label>
              <input
                type="radio"
                id="series"
                name="type"
                className="scale-150"
                value="series"
                onChange={()=>setType("series")}
                checked={type=="series"}
                />
            </div>
          </div>
                </div>
        </div>
        </div>
        <button className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0 text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
