import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

function get_data(){
  let x=JSON.parse(localStorage.getItem('episode_data'))
  if(x)
    return x
  return {
    index:-1,
    files:[],
    prevFiles:[],
    nxtFiles:[],
    iframeCode:'',
    reviews:[],
    user_liked:false,
    user_disliked:true,
    id:null,
    likes:[],
    dislikes:[]
  }
}

const initialState=get_data()


function set_episode(state,action){
  const {index,files}=action.payload;
  state.index=index
  if(files){
    state.files=files
  }
  let a = [];
    for (let i = 0; i < index; i++) {
      a.push(state.files[i]);
    }
    state.prevFiles=a;
    a = [];
    for (let i = index + 1; i < state.files.length; i++) {
        a.push(state.files[i]);
    }
    state.nxtFiles=a;
    state.iframeCode=`<iframe src="https://cdnwish.com/e/${state.files[state.index].file_code}" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" width="100%" height="100%" allowfullscreen></iframe>`
    localStorage.setItem('episode_data',JSON.stringify(state))
}

    export const fetchReviews = createAsyncThunk(
        'fetchReviews',
        async (file_code) => { 
          try { 
            const {VITE_BACKEND_LINK}=import.meta.env
            const response = await axios.post(`${VITE_BACKEND_LINK}/get_reviews`, {
              file_code
            });
            return response.data.reviews;
          } catch (error) {
            console.error('Error fetching reviews:', error);
            // Handle the error appropriately
          }
        }
      );
      

export const episodeSlice=createSlice({
    name:'episode',
    initialState,
    reducers:{
        set_files:(state,action)=>setFiles(state,action),
        set_Episode:(state,action)=>set_episode(state,action)
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchReviews.fulfilled,(state,action)=>{
            console.log('Done')
            state.reviews=action.payload.reviews;
            state.id=action.payload._id
            state.likes=action.payload.likes
            state.dislikes=action.payload.dislikes
            let uid=JSON.parse(localStorage.getItem('User'))._id
            let x=state.likes.includes(uid)
            let y=state.dislikes.includes(uid)
            state.user_liked=x
            state.user_disliked=y
            localStorage.setItem('episode_data',JSON.stringify(state))
        })
    }
})

export const{set_files,set_Episode}=episodeSlice.actions;
export default episodeSlice.reducer;