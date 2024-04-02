import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from '../../Assets/loading.gif'
const Edit = () => {
  let [series, setSeries] = useState([]);
  let [movies, setMovies] = useState([]);
  let [isLoading,setLoading]=useState(false)
  async function getSeries() {
    setLoading(true)
    let response = await axios.get("http://localhost:8080/get_series");
    response = response.data;
    setSeries(response);
    setMovies([]);
    setLoading(false)
  }
  async function getMovies() {
    setLoading(true)
    let response = await axios.get("http://localhost:8080/get_movies");
    response = response.data;
    setMovies(response);
    setSeries([]);
    setLoading(false)
  }
  async function rem(type, id) {
    console.log(id)
    let response = await axios.post("http://localhost:8080/delete_anime", {
        type,
        id,
    });
  }
  async function handleSubmitedit(e, id) {
    setLoading(true)
    e.preventDefault();
    let fd = new FormData();
    fd.append("id", id);
    fd.append("name", e.target.name.value);
    fd.append("cover_image", e.target.cover_image.value);
    fd.append("big_image", e.target.big_image.value);
    fd.append("desc", e.target.desc.value);
    fd.append("fld_id", e.target.fld_id.value);
    fd.append("nseasons", e.target.nseasons.value);
    fd.append("nepisodes", e.target.nepisodes.value);
    fd.append("type", e.target.type.value);
    let encoded = new URLSearchParams(fd).toString();
    try {
      let response = await axios.post(
        "http://localhost:8080/edit_anime",
        encoded,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
    setLoading (false)
  }
  return (
    <div>
{
          isLoading?(<div className="h-screen w-full flex justify-center items-center text-white">
           <img src={logo} className="w-32" alt="" /> <p className="text-xl ">Loading</p>
            </div>
            ):(
    <div className="w-screen py-32 min-h-screen flex flex-col items-center justify-center">
      <div className="flex">
        <button
          onClick={() => getSeries()}
          className="hover:bg-gradient-to-r text-white hover:from-[#be51ca] hover:to-[#753eb9] inline mr-2 ml-3 py-2.5 px-6 rounded-3xl bg-gradient-to-r from-[#be51caac] to-[#763eb9a7]"
          >
          Edit Series
        </button>
        <button
          onClick={() => getMovies()}
          className="hover:bg-gradient-to-r text-white hover:from-[#be51ca] hover:to-[#753eb9] inline mr-2 ml-3 py-2.5 px-6 rounded-3xl bg-gradient-to-r from-[#be51caac] to-[#763eb9a7]"
          >
          Edit Movies
        </button>
      </div>
      <div>
        {series.length == 0 ? (
          <span></span>
          ) : (
            <div className="flex flex-col gap-14 items-center mt-14">
            <h2 className="text-3xl font-bold text-white">Edit Series</h2>
            {series.map((folder, index) => (
              <div className="flex flex-col items-center gap-5">
                <h3 className="text-white font-mono text-2xl">{folder.name}</h3>
                <form
                  className="flex flex-col gap-4 w-50 justify-center items-center"
                  onSubmit={(e) => handleSubmitedit(e, folder._id)}
                  >
                  <div className="flex w-full justify-between items-center">
                    <label
                      className="text-white font-mono text-[18px]"
                      htmlFor="name"
                      >
                      Name Of Series
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.name)
                        : (e.target.value = e.target.value);
                      }}
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
                      type="text"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      id="big_image"
                      name="big_image"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.big_image)
                        : (e.target.value = e.target.value);
                      }}
                      required
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
                      id="cover_image"
                      name="cover_image"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.cover_image)
                        : (e.target.value = e.target.value);
                      }}
                      required
                      />
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <label
                      className="text-white font-mono text-[18px]"
                      htmlFor="desc"
                      >
                      Description
                    </label>
                    <input
                      type="text"
                      id="desc"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      name="desc"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.desc)
                        : (e.target.value = e.target.value);
                      }}
                      />
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <label
                      className="text-white font-mono text-[18px]"
                      htmlFor="fld_id"
                      >
                      Folder ID
                    </label>
                    <input
                      type="text"
                      id="fld_id"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      name="fld_id"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.fld_id)
                        : (e.target.value = e.target.value);
                      }}
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
                      id="nepisodes"
                      name="nepisodes"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.nepisodes)
                        : (e.target.value = e.target.value);
                      }}
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
                      id="nseasons"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      name="nseasons"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.nseasons)
                        : (e.target.value = e.target.value);
                      }}
                      />
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <legend className="text-white font-mono text-[18px]">
                      Type
                    </legend>
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
                          id="movie"
                          name="type"
                          className="scale-150"
                          value="movies"
                          />
                      </div>
                      <div className="text-white flex gap-[15px] text-[18px] font-sans">
                        <label
                          htmlFor="series"
                          className="text-white font-mono text-[18px]"
                          >
                          Series
                        </label>
                        <input
                          type="radio"
                          id="series"
                          name="type"
                          className="scale-150"
                          value="series"
                          />
                      </div>
                    </div>
                  </div>
                  <div className="btns">
                    <button
                      className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0 ml-[50%] text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
                      type="button"
                      onClick={() => rem(folder.type, folder._id)}
                      >
                      Remove
                    </button>
                    <button
                      className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0 ml-[50%] text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
                      type="submit"
                      >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}
        {movies.length == 0 ? (
          <span></span>
        ) : (
          <div className="flex flex-col gap-14 items-center mt-14">
            <h2 className="text-3xl font-bold text-white">Edit Movies</h2>
            {movies.map((folder, index) => (
              <div className="flex flex-col items-center gap-5">
                <h3 className="text-white font-mono text-2xl">{folder.name}</h3>
                <form
                  className="flex flex-col gap-4 w-50 justify-center items-center"
                  onSubmit={(e) => handleSubmitedit(e, folder._id)}
                  >
                  <div className="flex w-full justify-between items-center">
                    <label
                      className="text-white font-mono text-[18px]"
                      htmlFor="name"
                      >
                      Name Of Series
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.name)
                        : (e.target.value = e.target.value);
                      }}
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
                      type="text"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      id="big_image"
                      name="big_image"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.big_image)
                        : (e.target.value = e.target.value);
                      }}
                      required
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
                      id="cover_image"
                      name="cover_image"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.cover_image)
                        : (e.target.value = e.target.value);
                      }}
                      required
                      />
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <label
                      className="text-white font-mono text-[18px]"
                      htmlFor="desc"
                      >
                      Description
                    </label>
                    <input
                      type="text"
                      id="desc"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      name="desc"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.desc)
                        : (e.target.value = e.target.value);
                      }}
                      />
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <label
                      className="text-white font-mono text-[18px]"
                      htmlFor="fld_id"
                      >
                      Folder ID
                    </label>
                    <input
                      type="text"
                      id="fld_id"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      name="fld_id"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.fld_id)
                          : (e.target.value = e.target.value);
                        }}
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
                      id="nepisodes"
                      name="nepisodes"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.nepisodes)
                        : (e.target.value = e.target.value);
                      }}
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
                      id="nseasons"
                      className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                      name="nseasons"
                      onChange={(e) => {
                        e.target.value == "same"
                        ? (e.target.value = folder.nseasons)
                        : (e.target.value = e.target.value);
                      }}
                      />
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <legend className="text-white font-mono text-[18px]">
                      Type
                    </legend>
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
                          id="movie"
                          name="type"
                          className="scale-150"
                          value="movies"
                          />
                      </div>
                      <div className="text-white flex gap-[15px] text-[18px] font-sans">
                        <label
                          htmlFor="series"
                          className="text-white font-mono text-[18px]"
                          >
                          Series
                        </label>
                        <input
                          type="radio"
                          id="series"
                          name="type"
                          className="scale-150"
                          value="series"
                          />
                      </div>
                    </div>
                  </div>
                  <div className="btns">
                    <button
                      className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0 ml-[50%] text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
                      type="button"
                      onClick={() => rem(folder.type, folder._id)}
                      >
                      Remove
                    </button>
                    <button
                      className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0 ml-[50%] text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
                      type="submit"
                      >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>)}
        </div>
  );
};

export default Edit;
