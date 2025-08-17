import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector , useDispatch} from "react-redux";
import { fetchReviews, set_Episode} from "../../Redux/episodeSlice";
const {VITE_BACKEND_LINK}=import.meta.env
const Episode = () => {

  // Variables Initialization
  let dispatch=useDispatch()

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-6">
        {title === '' ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="ml-4 text-xl">Loading episode...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">
              {iframeCode && (
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
                  <div className="aspect-video">
                    <iframe
                      src={iframeCode}
                      width="100%"
                      height="100%"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-3">{title}</h1>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-gray-400">{views} views</p>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => toggle('dislikes', 'likes')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-gray-700 ${
                            user_liked ? 'text-orange-500 bg-gray-700' : 'text-gray-300'
                          }`}
                        >
                          <ion-icon name="thumbs-up"></ion-icon>
                          <span>{likes.length}</span>
                        </button>
                        <button
                          onClick={() => toggle('likes', 'dislikes')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-gray-700 ${
                            user_disliked ? 'text-red-500 bg-gray-700' : 'text-gray-300'
                          }`}
                        >
                          <ion-icon name="thumbs-down"></ion-icon>
                          <span>{dislikes.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <ion-icon name="chatbubbles"></ion-icon>
                  Comments ({reviews.length})
                </h3>
                
                <form onSubmit={handleSubmit} className="mb-6">
                  <input type="hidden" name="name" value={JSON.parse(localStorage.getItem('User')).username} />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      name="comment"
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </form>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.map((comment, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-orange-400">{comment.name}</span>
                        {comment.name === JSON.parse(localStorage.getItem('User')).username && (
                          <button
                            onClick={() => del(comment._id)}
                            className="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <p className="text-gray-200">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {files.length > 1 && (
              <div className="xl:col-span-1">
                <div className="bg-gray-800 rounded-xl p-6 sticky top-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ion-icon name="play-circle"></ion-icon>
                    Episodes
                  </h2>
                  <div className="space-y-3 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {prevFiles.map((episode, i) => (
                      <button
                        key={i}
                        onClick={() => changeIndex(i)}
                        className="w-full group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
                      >
                        <img
                          src={episode.snap_link}
                          alt={`Episode ${i + 1}`}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                          <span className="text-white font-semibold">Episode {i + 1}</span>
                        </div>
                      </button>
                    ))}
                    {nxtFiles.map((episode, i) => (
                      <button
                        key={i + index + 1}
                        onClick={() => changeIndex(i + index + 1)}
                        className="w-full group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
                      >
                        <img
                          src={episode.snap_link}
                          alt={`Episode ${i + index + 2}`}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                          <span className="text-white font-semibold">Episode {i + index + 2}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Episode;