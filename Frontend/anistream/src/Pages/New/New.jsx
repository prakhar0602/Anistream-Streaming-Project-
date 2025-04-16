import React, { useEffect, useState } from "react";
import LoadingScreen from "../../Components/LoadingScreen";
import { Link } from "react-router-dom";
import addAnime from "../../Assets/AddAnime.png"
import bimage from '../../Assets/anime_moon_landscape.jpg'

const New = () => {
  const [showFileUpload, setFileUpload] = useState(false);
  const [showURLUpload, setURLUpload] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setLoading(false)
  }, []);

  return (
    <div className="w-full max-w-full h-screen pt-24 pb-3 bg-cover"
    style={{ backgroundImage: `url(${bimage})` }}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="h-full w-full max-w-full flex flex-col justify-center items-center gap-9">
          <div className="flex justify-center items-center">
            {/* <img
              src="src/Assets/add_anime.png"
              className="h-[200px] "
              alt="image"
            /> */}
            <h1 className="font-dragon_ball ">
              <img src={addAnime} alt="" className="w-[500px]"/>
            </h1>
          </div>

          <div className="msg">
            <h3>{message}</h3>
          </div>

          <div className="w-full h-[100%] flex gap-14 justify-center px-14">
            <div className="flex items-center gap-5 w-[100%]  text-black text-[25px] justify-around">
              <div className="flex flex-col gap-5 justify-center items-center">

              <Link
                to="/upload/files"
                className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[40px] border-0  text-black font-fantasy bg-white/60 hover:scale-110 transition-all 
                 duration-200 ease-in"
                >
                Upload Files
              </Link>
              <Link
                    className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[30px] border-0  text-black font-fantasy bg-white/60 hover:scale-110 transition-all 
                 duration-200 ease-in"
                    to="/upload/sync"
                    >
                <p className="flex justify-center items-center gap-1">
                  <ion-icon name="sync"></ion-icon>
                  Sync
                </p>
              </Link>
                  </div>
<div className="flex flex-col gap-5 justify-center items-center">
              <Link
                to="/upload/edit"
                className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[30px] border-0  text-black font-fantasy bg-white/60 hover:scale-110 transition-all 
                 duration-200 ease-in"
                >
                <ion-icon name="sync"></ion-icon>Edit
              </Link>
<Link
                to="/upload/url"
                className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[40px] border-0  text-black font-fantasy bg-white/60 hover:scale-110 transition-all 
                 duration-200 ease-in"
                >
                Upload By URL
              </Link>
                  </div>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default New;
