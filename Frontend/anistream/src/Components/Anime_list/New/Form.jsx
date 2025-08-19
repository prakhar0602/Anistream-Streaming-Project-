import React, { useState } from "react";
import axios from 'axios';
import FolderList from "./FolderList";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Form = () => {
  const { VITE_BACKEND_LINK } = import.meta.env;
  const [name, setName] = useState("");
  const [big_image, setBigImage] = useState("");
  const [cover_image, setCoverImage] = useState("");
  const [cover_image2, setCoverImage2] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("");
  const [fld_id, setFld_id] = useState("");  // Folder ID
  const [genres, setGenres] = useState([]);
  const [seasonNames, setSeasonNames] = useState([""]);
  const user = useSelector((state) => state.user.user);

  const genreOptions = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", 
    "Romance", "Sci-Fi", "Thriller", "Slice of Life", "Sports", "Supernatural", 
    "Mecha", "Historical", "School", "Military", "Music", "Psychological"
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (user.type !== 'admin') {
      toast.warning('Request Rejected', { position: 'top-center' });
      return;
    }

    let formData = new FormData();
    formData.append("name", name);
    formData.append("big_image", big_image);
    formData.append("cover_image", cover_image);
    formData.append("cover_image2", cover_image2);
    formData.append("desc", desc);
    formData.append("seasons", JSON.stringify(seasonNames.filter(name => name.trim())));
    formData.append("fld_id", fld_id);
    formData.append("type", type);
    formData.append("userID",user._id);
    formData.append("genres", JSON.stringify(genres));

    try {
      let response = await axios.post(`${VITE_BACKEND_LINK}/add_anime`, new URLSearchParams(formData).toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        timeout: 120000, // 2 minutes timeout
      });
      // console.log(response)
      response=response.data.data
      
      if(response=="Data added"){
        toast.success("Anime added");
      }
      else
        toast.error("Anime not added");
    } catch (error) {
      if (error.code === 'ECONNRESET' || error.message.includes('timeout')) {
        toast.info("Processing... Please check if anime was added successfully");
      } else {
        toast.error("Anime not added");
      }
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col gap-5 ">
      {/* Folder Selection */}
      <FolderList folder={fld_id} setFolder={setFld_id} />

      {/* Show form only if fld_id is selected */}
      {fld_id && (
        <form className="flex flex-col gap-14 w-fit justify-center items-center bg-black/50 p-5 rounded-xl" onSubmit={handleSubmit}>
          <div className="flex gap-24">
            <div className="flex flex-col gap-5">
              <div className="flex w-full justify-between  font-mono items-center">
                <label className="text-white font-mono text-[18px]" htmlFor="name">Name Of Series</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                  className="outline-none p-[10px] ml-[10px] border-[1.5px] border-white text-[25px] rounded-[10px]" />
              </div>

              <div className="flex w-full justify-between items-center">
                <label className="text-white font-mono text-[18px]" htmlFor="big_image">Big Image</label>
                <input type="text" id="big_image" value={big_image} onChange={(e) => setBigImage(e.target.value)}
                  className="outline-none p-[10px] ml-[10px] border-[1.5px] border-white text-[25px] rounded-[10px]" />
              </div>

              <div className="flex w-full justify-between items-center">
                <label className="text-white font-mono text-[18px]" htmlFor="cover_image">Cover Image</label>
                <input type="text" id="cover_image" value={cover_image} onChange={(e) => setCoverImage(e.target.value)}
                  className="outline-none p-[10px] ml-[10px] border-[1.5px] border-white text-[25px] rounded-[10px]" />
              </div>
              <div className="flex w-full justify-between items-center">
                <label className="text-white font-mono text-[18px]" htmlFor="cover_image">Cover Image 2</label>
                <input type="text" id="cover_image" value={cover_image2} onChange={(e) => setCoverImage2(e.target.value)}
                  className="outline-none p-[10px] ml-[10px] border-[1.5px] border-white text-[25px] rounded-[10px]" />
              </div>

              <div className="flex w-full justify-between items-center">
                <label className="text-white font-mono text-[18px]" htmlFor="desc">Description</label>
                <input type="text" id="desc" value={desc} onChange={(e) => setDesc(e.target.value)}
                  className="outline-none p-[10px] ml-[10px] border-[1.5px] border-white text-[25px] rounded-[10px]" />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex w-full justify-between items-center">
                <label className="text-white font-mono text-[18px]" htmlFor="fld_id">Folder ID</label>
                <input type="text" id="fld_id" value={fld_id} disabled
                  className="outline-none p-[10px] ml-[10px] border-[1.5px] border-white text-[25px] rounded-[10px]" />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-white font-mono text-[18px]">Season Names</label>
                {seasonNames.map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        const updated = [...seasonNames];
                        updated[index] = e.target.value;
                        setSeasonNames(updated);
                      }}
                      className="outline-none p-[10px] border-[1.5px] border-white text-[20px] rounded-[10px] flex-1"
                      placeholder={`Season ${index + 1} name`}
                    />
                    <button
                      type="button"
                      onClick={() => setSeasonNames(seasonNames.filter((_, i) => i !== index))}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      ❌
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setSeasonNames([...seasonNames, ""])}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-fit"
                >
                  + Add Season
                </button>
              </div>

              <div className="flex w-full justify-between items-center">
                <label className="text-white font-mono text-[18px]" htmlFor="genres">Genres</label>
                <div className="border-[1.5px] border-white rounded-[10px] p-2 ml-[10px] h-32 overflow-y-auto bg-white">
                  {genreOptions.map(genre => (
                    <label key={genre} className="flex items-center gap-2 text-black cursor-pointer hover:bg-gray-100 p-1">
                      <input
                        type="checkbox"
                        value={genre}
                        checked={genres.includes(genre)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setGenres([...genres, genre]);
                          } else {
                            setGenres(genres.filter(g => g !== genre));
                          }
                        }}
                        className="scale-125"
                      />
                      <span className="text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex w-full justify-between items-center">
                <legend className="text-white font-mono text-[18px]">Type</legend>
                <div className="flex gap-[110px]">
                  <div className="text-white flex gap-[15px] text-[18px] font-sans">
                    <label htmlFor="movie">Movies</label>
                    <input type="radio" id="movie" name="type" value="movies" onChange={() => setType("movies")} checked={type === "movies"} className="scale-150" />
                  </div>
                  <div className="text-white flex gap-[15px] text-[18px] font-sans">
                    <label htmlFor="series">Series</label>
                    <input type="radio" id="series" name="type" value="series" onChange={() => setType("series")} checked={type === "series"} className="scale-150" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="rounded-[15px] py-[10px] px-[30px] text-[20px] border-0 text-white font-fantasy bg-blue-600">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Form;
