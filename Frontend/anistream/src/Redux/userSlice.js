import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const {VITE_BACKEND_LINK}=import.meta.env

export function get_user(){
    return JSON.parse(localStorage.getItem('User'))
}

let initialState={user:get_user()}


function login1(state,action){
    try{
    state.user=action.payload;
    localStorage.setItem('User',JSON.stringify(action.payload));
    console.log('done')
}
    catch(e){
        console.log(e)
    }
}
export const logout=createAsyncThunk('logout',async()=>{
    let response = await axios.get('https://anistream-streaming-project.onrender.com/logout',{
        withCredentials:true
      })
    return null;
})

export async function check_user(){
    axios.defaults.withCredentials = true;
    let response=await axios.get(`${VITE_BACKEND_LINK}/login_status`,{
        withCredentials:true
    });
    return response.data.login_status;
}
export const userSlice=createSlice({
    name:'User',
    initialState,
    reducers:{
        login:(state,action)=>login1(state,action)
    },
    extraReducers:(builder)=>{
        builder.addCase(logout.fulfilled,(state,action)=>{
            state.user=null
            localStorage.setItem('User','null')
            console.log((state.user))
        })
    }
})
export const {login} = userSlice.actions;
export default userSlice.reducer