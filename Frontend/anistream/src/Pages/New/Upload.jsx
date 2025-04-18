import React, { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import URLUpload from "./URLUpload";
import FolderCreation from "../../Components/Anime_list/New/FolderCreation";
import { useSelector } from "react-redux";
import LoadingScreen from "../../Components/LoadingScreen";
import Form from "../../Components/Anime_list/New/Form";
import Sync from "../../Components/Anime_list/New/Sync";
import Edit from "../../Components/Anime_list/New/Edit";
import { useParams } from "react-router-dom";
import bimage from "../../Assets/anime_moon_landscape.jpg";

const Upload = () => {
  const user = useSelector((state) => state.user.user);
  const { type } = useParams();
  const [showForm, setForm] = useState(false);
  const [showForm1, setShowForm1] = useState(false);
  const [folderShow, setfolderShow] = useState(false);
  const [showURL, seturlShow] = useState(false);

  useEffect(() => {}, []);
  return (
    <div
      className={`w-full h-screen bg-cover`}
      style={{ backgroundImage: `url(${bimage})` }}
    >
      {type == "files" ? (
        <div className="flex h-full justify-start items-center gap-10 px-14">
          <div className="flex flex-col gap-10 w-[35%]">
            <button
              onClick={() => {setfolderShow(!folderShow);setShowForm1(false);setForm(false)}}
              className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[40px] border-0  text-black font-fantasy bg-white/60 hover:scale-110 transition-all 
                             duration-200 ease-in"
            >
              {folderShow ? "Close" : "Create New Folder"}
            </button>
            <button
              onClick={() => {setShowForm1(!showForm1);setfolderShow(false);setForm(false);}}
              className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[40px] border-0  text-black font-fantasy bg-white/60 hover:scale-110 transition-all 
                 duration-200 ease-in"
            >
              {showForm1 ? "Close File Upload" : "Upload Files"}
            </button>
            <button
              onClick={() => {setForm(!showForm);setShowForm1(false);setfolderShow(false)}}
              className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[40px] border-0  text-black font-fantasy bg-white/60 hover:scale-110 transition-all 
                    duration-200 ease-in"
            >
              {showForm ? "Hide Form" : "Show Form"}
            </button>
          </div>
          <div className={`flex w-full justify-center ${showForm?"items-start":"items-center"} h-[90vh] overflow-scroll no-scrollbar`}>
            {showForm1 ? <FileUpload /> : <span></span>}
            {folderShow ? <FolderCreation user={user} /> : <span></span>}
            {showForm ? <Form /> : <span></span>}
          </div>
        </div>
      ) : type == "url" ? (
        <div className="flex w-full h-full items-center">
          <div className=" w-[30%] h-full justify-center items-center flex flex-col gap-10">

          <button
            onClick={() => {seturlShow(!showURL);setForm(false);}}
            className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[32px] border-0  text-white font-fantasy bg-white/20"
          >
            {showURL ? "Hide Upload" : "URL Upload"}
          </button>
          <button
            onClick={() => {setForm(!showForm);seturlShow(false)}}
            className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[32px] border-0  text-white font-fantasy bg-white/20"
            >
            {showForm ? "Hide Form" : "Show Form"}
          </button>
          
            </div>
          <div className={`flex h-full justify-center ${showForm?"items-start h-[90vh] overflow-scroll w-[90%] no-scrollbar":"items-center"}`}>
          {showURL ? <URLUpload /> : <span></span>}
          {showForm ? <Form /> : <span></span>}
          </div>
        </div>
      ) : type == "sync" ? (
        <Sync />
      ) : type == "edit" ? (
        <Edit />
      ) : (
        <p>Page not defined</p>
      )}
    </div>
  );
};

export default Upload;
