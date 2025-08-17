import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const {VITE_BACKEND_LINK}=import.meta.env

export function get_user(){
    try{
        return JSON.parse(localStorage.getItem('User'))
    }
    catch(e){
        return undefined;
    }
}

let initialState={user:get_user()}


function login1(state,action){
    try{
    state.user=action.payload;
    localStorage.setItem('User',JSON.stringify(action.payload));
}
catch(e){
    console.log(e)
}
}
function logout1(state,action){
    state.user=undefined
    localStorage.removeItem('User');
}
export async function check_user(){
    axios.defaults.withCredentials = true;
    let response=await axios.get(`${VITE_BACKEND_LINK}/verify_token`,{
    });
    return response.data.bool;
}
export const userSlice=createSlice({
    name:'User',
    initialState,
    reducers:{
        login:(state,action)=>login1(state,action),
        logout:(state,action)=>logout1(state,action)
    }
})
export const {login,logout} = userSlice.actions;
export default userSlice.reducer