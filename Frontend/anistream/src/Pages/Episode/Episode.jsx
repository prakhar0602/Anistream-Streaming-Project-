// Initializations
import React, { useEffect, useState } from "react";
// import "./Episode.css";
import axios from "axios";
import logo from '../../Assets/loading.gif'
import logo1 from '../../Assets/loading....gif'
import { Link } from "react-router-dom";
import { useSelector , useDispatch} from "react-redux";
import { fetchReviews, set_Episode} from "../../Redux/episodeSlice";
const {VITE_BACKEND_LINK}=import.meta.env
const Episode = () => {

  // Variables Initialization
  let dispatch=useDispatch()
  let [isLoading,setLoading]=useState(true)
  const [title,setTitle]=useState('')
  const [views,setViews]=useState('')
  let {index,files,prevFiles,user_liked,user_disliked,nxtFiles,iframeCode,reviews,id,likes,dislikes}=useSelector(state=>state.episode)

  // Fetching and setting of files from Server 
  useEffect(() => {
    async function ab(){
      setTitle('')
      let response=await axios.get(`https://api.streamwish.com/api/file/info?key=11124m28yb5z5qbkuh1ru&file_code=${files[index].file_code}`)
      setViews(response.data.result[0].file_views)
      await dispatch(fetchReviews(files[index].file_code))
      setTitle(response.data.result[0].file_title)
    }
    ab()
  }, [index]);
  
  
  // change of index value
  async function changeIndex(i){
    let a={
      index:i  
    }
    // await dispatch(fetchReviews(files[i].file_code))
    await dispatch(set_Episode(a))
  }


  // handle Submit 
  async function handleSubmit(e){
    e.preventDefault();
    let response=await axios.post(`${VITE_BACKEND_LINK}/add_review`,{name:e.target.name.value,comment:e.target.comment.value,id:files[index].file_code});
    dispatch(fetchReviews(files[index].file_code))
    e.target.name.value="";
    e.target.comment.value="";
  }
  async function toggle(preop,op){
    let uid=(JSON.parse(localStorage.getItem('User'))._id)
    console.log(uid)
    console.log(id)
    await axios.get(`${VITE_BACKEND_LINK}/toggle/${preop}/${op}/${id}/${uid}`)
    dispatch(fetchReviews(files[index].file_code))
  }
  // update Reviews
  async function del(did){
    await axios.post(`${VITE_BACKEND_LINK}/delete_review`,{id,did})
    dispatch(fetchReviews(files[index].file_code))
  }
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
       {
          title==''?(<div className="h-full w-full flex justify-center items-center text-white">
           <img src={logo} className="w-32" alt="" /> <p className="text-xl ">Loading</p>
            </div>
            ):(<div className="flex flex-col xl:flex-row m-0 lg:p-32 p-5 gap-10 min-h-screen w-fit">

       <div className="flex flex-col items-start">
        {
          iframeCode ? (
            <div className="bg-white/20 text-white text-bold w-[calc(100vw-40px)] max-w-[888px] lg:w-full">
              <div className='xl:w-[888px] lg:h-[500px] w-full h-[calc(100vw*0.5125)] ' dangerouslySetInnerHTML={{ __html: iframeCode }} />
                <div className="flex flex-col lg:p-5 p-2 gap-3">
                  <p className="m-0 lg:text-3xl text-xl font-bold ">{title}</p>
                  <p className="m-0 lg:text-md text-sm">{views} views</p>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-1 lg:text-xl text-lg pointer">
                    {
                      user_liked?(
                        <div className= 'text-red-600'>

                      <ion-icon name="thumbs-up"  onClick={()=>toggle('dislikes','likes')}></ion-icon>
                        </div>
                    ):(
                      <div className= 'text-white'>

                      <ion-icon name="thumbs-up" onClick={()=>toggle('dislikes','likes')}></ion-icon>
                      </div>
                      )
                    }
                    <p>{likes.length}</p>
                    </div>
                    <div className="flex items-center gap-1 lg:text-xl text-lg pointer ">
                   {
                     user_disliked?(
                       <div className= 'text-red-600'>

                      <ion-icon name="thumbs-down" onClick={()=>toggle('likes','dislikes')}></ion-icon>
                        </div>):(
                          <div className= 'text-white'>
                      <ion-icon name="thumbs-down" onClick={()=>toggle('likes','dislikes')}></ion-icon>
                    </div>
                    )
                  }
                    <p>{dislikes.length}</p>
                  </div>
                  </div>
                </div>
              </div>
          )
          :(
            <div></div>
            )
          }
         <div className="flex flex-col mx-auto my-14 p-5 bg-white/20 w-[calc(100vw-40px)] lg:w-full">
          <h3 className="text-white text-xl font-medium mb-4">
            Comments
            </h3>
          <div className="flex gap-1 mb-1 p-2  shadow-[0_1px_3px_rgba(0, 0, 0, 0.1)]">
            <form className='flex items-center gap-1 w-full' onSubmit={handleSubmit}>
              <div className="hidden">
                <input type="hidden" name='name' id='name' value={JSON.parse(localStorage.getItem('User')).username} />
              </div>
              <div className="">
                <label className="font-bold mb-1 mr-2 " htmlFor="comment">Comment:</label>
                <input className='mx-2 my-1 text-md outline-none p-2' type="text" name='comment' id='comment' />
              </div>
              <button className="px-2 py-1 border-0 ml-14 w-24 rounded-sm cursor-pointer bg-[#3a98e6] text-lg">Post</button>
            </form>
          </div>
          <div className="flex flex-col gap-1">
            {
              reviews.map((a,index)=>(
                <div className="rounded-lg mt-2 text-white bg-[#00000025] border-[1px] border-black shadow-[0_1px_3px_rgba(0, 0, 0, 0.1)]" key={index}>
                  <p className="p-2 bg-black/20 text-white">{a.name}</p>
                  <p className="p-2">{a.comment}</p>
                  {
                    a.name==(JSON.parse(localStorage.getItem('User'))).username?
                    (<button className='bg-white rounded text-black p-1 ml-1 mb-1' onClick={()=>del(a._id)}>Delete</button>)
                    :(
                      ''
                      )
                    }
                </div>
              ))              
            }
          </div>
        </div>
      </div>
      {
        files.length>1?(
      <div className="flex flex-col items-center lg:w-72 w-full">
        <p className="text-3xl text-white w-full text-center pb-5 border-b-2">Episodes</p>
        <div className="flex flex-col gap-2 h-[calc(100vh-200px)] no-scrollbar overflow-y-scroll mt-5">
          {
            prevFiles.map((m, i) => (
              <Link className="relative" onClick={()=>changeIndex(i)}>
                <div className="flex pointer flex-col  items-center justify-center">
                  <img className='w-72' src={m.snap_link} alt="img" />
                  <p className="flex absolute justify-center text-3xl text-white bg-black/70 hover:bg-black/40 w-full h-full items-center">Episode {i + 1}</p>
                </div>
              </Link>
            ))
          }
          {
            nxtFiles.map((m, i) => (
              <Link className="relative" onClick={()=>changeIndex(i+index+1)}>
              <div className="flex pointer flex-col  items-center justify-center">
                <img className='w-72' src={m.snap_link} alt="img" />
                <p className="flex absolute justify-center text-3xl text-white hover:bg-black/40 bg-black/70 w-full h-full items-center" >Episode {i + index + 2}</p>
              </div>
            </Link>
            ))
          }
        </div>
      </div>):(<span></span>)} 
       </div>
       )}
    </div>
  );
};

export default Episode;