import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const Sync = (props) => {
    const [folders,setFolders] = useState([]);
    const user = useSelector((state)=>state.user.user);
    const setLoading=props.setLoading;
    async function sync() {
        if(user.type!='admin'){
          toast.warning('Request Rejected',{
            position:'top-center'
          })
          return
        }
        try {
            let response = await axios.get(
                "https://api.streamwish.com/api/folder/list?key=11124m28yb5z5qbkuh1ru&files=1"
            );
            response = response.data.result.folders;
            console.log(response)
            let animes=[],f=[];
            let z=1;
            for(let i of response){
                animes.push(i);
                if(z%2==0){
                    f.push([...animes]);
                    animes=[];
                }
                z++;
            }
            console.log(f)
            setFolders(f);
        } catch (error) {
            console.log(error);
        }
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
            `${VITE_BACKEND_LINK}/add_anime`,
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



    function rem(i,j) {
        if(user.type!='admin'){
          toast.warning('Request Rejected',{
            position:'top-center'
          })
          return
        }
        let f=[...folders];
        f[i][j]=undefined;

        setFolders(f);
      }

    useEffect(()=>{
        setLoading(true)
        console.log('started')
        sync();
        setLoading(false)
    },[]);
    return (
    <div>
    {folders.length !== 0 ? (
        <div className="mt-[20px] flex flex-col items-center gap-7">
          <h2 className="text-3xl m-[10px] red font-semibold">Synced items</h2>
          {folders.map((anime, i) => (
            <div className='flex gap-28 mb-14'>
{anime.map((folder,index)=>(
            folder==undefined?(
                <h2 className="text-3xl m-[10px] red font-semibold">Removed</h2>
            ):(
            <div className="flex flex-col " key={folder.fld_id}>
              <h2 className="a1">Anime {index +i*2+ 1}</h2>
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
                    onClick={() => rem(i,index)}
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
          </div>)))}
            </div>
          ))}
        </div>
      ) : (
          <div></div>
        )}
        </div>
    )
}

export default Sync