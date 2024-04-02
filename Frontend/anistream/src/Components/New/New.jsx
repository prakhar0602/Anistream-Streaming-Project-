import React, { useEffect, useState } from "react";
import axios from "axios";
import logo from '../../Assets/loading.gif'
import "./New.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const New = () => {
  let [name, setName] = useState("");
  let [big_image, setBigImage] = useState("");
  let [cover_image, setCoverImage] = useState("");
  let [desc, setDesc] = useState("");
  let [message, setMessage] = useState("");
  let [message2, setMessage2] = useState("");
  let [as, setas] = useState("");
  let [fld_id, setFld_id] = useState("");
  let [folders, setFolders] = useState([]);
  let [nepisodes, setEpisodes] = useState([]);
  let [nseasons, setSeasons] = useState([]);
  const [isLoading,setLoading] = useState(true)
  const user=useSelector(state=>state.user.user)
  useEffect(()=>{
    setLoading(false)
  },[])
  function handleName(event) {
    setName(event.target.value);
  }
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
    formData.append("type", event.target.type.value);
    let encoded = new URLSearchParams(formData).toString();
    console.log(encoded);
    try {
      let response = await axios.post(
        "http://localhost:8080/add_anime",
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
  async function sync() {
    if(user.type!='admin'){
      toast.warning('Request Rejected',{
        position:'top-center'
      })
      return
    }
    setLoading(true)
    try {
      let response = await axios.get(
        "https://api.streamwish.com/api/folder/list?key=11124m28yb5z5qbkuh1ru&files=1"
      );
      response = response.data.result.folders;
      setFolders(response);
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
  }
  async function handleSubmitedit(e) {
    e.preventDefault();
    if(user.type!='admin'){
      toast.warning('Request Rejected',{
        position:'top-center'
      })
      return
    }
    setLoading(true)
    let fd = new FormData();
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
        "http://localhost:8080/add_anime",
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
    let a = folders.filter((ee) => ee.fld_id != e.target.fld_id.value);
    setFolders(a);
    setLoading(false)
  }
  function rem(e) {
    if(user.type!='admin'){
      toast.warning('Request Rejected',{
        position:'top-center'
      })
      return
    }
    let a = folders.filter((ee) => ee.fld_id != e);
    setFolders(a);
  }

  async function folder_creation(e) {
    e.preventDefault();
    if(user.type!='admin'){
      toast.warning('Request Rejected',{
        position:'top-center'
      })
      return
    }
    setLoading(true)
    //create folder on server
    let fis, server;
    try {
      fis = await axios.get(
        `https://api.streamwish.com/api/folder/create?key=11124m28yb5z5qbkuh1ru&name=${name}`
      );
      fis = fis.data.result.fld_id;
      setFld_id(fis);
      localStorage.setItem("fld_id", fis);
    } catch (error) {
      console.log(error);
    }

    //create server upload link
    try {
      server = await axios.get(
        "https://api.streamwish.com/api/upload/server?key=11124m28yb5z5qbkuh1ru"
      );
      server = server.data.result;
      setas(server);
      console.log(server);
    } catch (error) {
      console.log(error);
    }
    setLoading(false)
  }
  return (
    <div>
    {
          isLoading? (<div className="h-screen w-full flex justify-center items-center text-white">
           <img src={logo} className="w-32" alt="" /> <p className="text-xl ">Loading</p>
            </div>
            ):(
    <div className="py-[90px] flex h-fit justify-center items-center flex-col gap-[40px]">
      <div className="flex justify-center items-center">
        <img
          src="src/Assets/add_anime.png"
          className="h-[200px] "
          alt="image"
          />
        <h1 className="-ml-[100px] text-[50px] font-fantasy font-[700]">
          <span className="a1">Add </span>
          <span className="a2">Anime</span>
        </h1>
      </div>
      <div className="msg">
        <h3>{message}</h3>
      </div>
      <div className="flex gap-[60px]">
        <form className="flex flex-col gap-[20px]" onSubmit={folder_creation}>
          <div className="flex justify-between items-center">
            <label className="text-white font-mono text-[18px]" htmlFor="name">
              Folder Name
            </label>
            <input
              className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
              type="text"
              id="name"
              name="name"
              onChange={handleName}
              value={name}
              />
            <button className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0 ml-[50%] text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]">
              Submit
            </button>
          </div>
        </form>
      </div>
      <div className="flex gap-14 items-center">
        <div className="flex">
          <form
            className="flex flex-col gap-4 w-50 justify-center items-center"
            onSubmit={(e) => handleSubmit(e)}
            >
            <div className="flex w-full justify-between items-center">
              <label
                className="text-white font-mono text-[18px]"
                htmlFor="name"
                >
                Name Of Series
              </label>
              <input
                className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                type="text"
                id="name"
                name="name"
                onChange={handleName}
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
              <label
                className="text-white font-mono text-[18px]"
                htmlFor="desc"
                >
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
            <div className="flex w-full justify-between items-center">
              <label
                className="text-white font-mono text-[18px]"
                htmlFor="fld_id"
                >
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
                    />
                </div>
              </div>
            </div>
            <button className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0 ml-[50%] text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]">
              Submit
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-9 w-fit items-center">
          <form
            className="flex flex-col gap-5 items-center"
            method="POST"
            encType="multipart/form-data"
            action={as}
            >
            <input type="hidden" name="key" value="11124m28yb5z5qbkuh1ru" />
            <input type="hidden" name="html_redirect" value="1" />
            <input type="hidden" name="fld_id" value={fld_id} />
            <div className="flex flex-col items-center justify-around gap-[25px]">
              <label
                htmlFor="name"
                className="text-white font-mono text-[18px]"
                >
                Upload Files
              </label>
              <input
                className="text-[20px]"
                type="file"
                id="file"
                name="file"
                multiple
                />
            </div>
            <button
              className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
              type="submit"
              >
              Upload
            </button>
          </form>
          <button
            className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
            onClick={sync}
            >
            <ion-icon name="sync"></ion-icon>
          </button>
          <Link
            to="/edit"
            className="hover:bg-gradient-to-r text-white hover:from-[#be51ca] hover:to-[#753eb9] inline mr-2 ml-3 py-2.5 px-6 rounded-3xl bg-gradient-to-r from-[#be51caac] to-[#763eb9a7]"
            >
            <ion-icon name="sync"></ion-icon>Edit
          </Link>
          <div className="msg">
            <h3>{message2}</h3>
          </div>
        </div>
      </div>
      {folders.length !== 0 ? (
        <div className="mt-[20px] flex flex-col items-center gap-[40px]">
          <h2 className="m-[10px] red">Synced items</h2>
          {folders.map((folder, index) => (
            <div className="flex flex-col " key={folder.fld_id}>
              <h2 className="a1">Anime {index + 1}</h2>
              <form
                className="flex flex-col gap-4 w-50 justify-center items-center"
                onSubmit={handleSubmitedit}
                >
                <div className="flex w-full justify-between items-center">
                  <label
                    className="text-white font-mono text-[18px]"
                    htmlFor="name"
                    >
                    Name Of Series
                  </label>
                  <input
                    className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                    type="text"
                    id="name"
                    name="name"
                    value={folder.name}
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
                    className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                    type="text"
                    id="cover_image"
                    name="cover_image"
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
                    className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                    type="text"
                    id="desc"
                    name="desc"
                    required
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
                    className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                    type="text"
                    id="fld_id"
                    name="fld_id"
                    value={folder.fld_id}
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
                    className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                    type="text"
                    id="nepisodes"
                    name="nepisodes"
                    onChange={(e) => changeepisodes(e)}
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
                    className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                    type="text"
                    id="nseasons"
                    name="nseasons"
                    onChange={(e) => changeSeasons(e)}
                    />
                </div>
                <div className="flex w-full justify-between items-center">
                  <legend className="text-white font-mono text-[18px]">
                    Type
                  </legend>
                  <div className="flex gap-[110px]">
                    <div className="text-white flex gap-[15px] text-[18px] font-verdana">
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
                        className="scale-150"
                        id="series"
                        name="type"
                        value="series"
                        />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-[20px]">
                  <button
                    className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
                    type="button"
                    onClick={() => rem(folder.fld_id)}
                    >
                    Remove
                  </button>
                  <button
                    className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]"
                    type="submit"
                    >
                    Save
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <div></div>
        )}
    </div>)}
        </div>
  );
};

export default New;
