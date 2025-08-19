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

let initialState={
    user:get_user(),
    isLoggedIn:null,
    userProfile:null,
    loading:false
}


function login1(state,action){
    try{
        state.user=action.payload;
        state.isLoggedIn = { bool: true };
        localStorage.setItem('User',JSON.stringify(action.payload));
    }
    catch(e){
        console.log(e)
    }
}
export const checkAuth = createAsyncThunk('user/checkAuth', async () => {
    try {
        const storedUser = localStorage.getItem('User');
        if (!storedUser) {
            return { isLoggedIn: { bool: false }, user: null, userProfile: null };
        }
        
        const userData = JSON.parse(storedUser);
        
        const response = await axios.get(`${VITE_BACKEND_LINK}/verify_token`, {
            withCredentials: true,
        });
        
        const isLoggedIn = response.data;
        
        let userProfile = null;
        if (isLoggedIn.bool) {
            try {
                const profileResponse = await axios.get(`${VITE_BACKEND_LINK}/user_profile`, {
                    withCredentials: true,
                });
                if (profileResponse.data.bool && profileResponse.data.user) {
                    userProfile = profileResponse.data.user;
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        }
        
        return { isLoggedIn, user: userData, userProfile };
    } catch (error) {
        console.error('Auth check failed:', error);
        return { isLoggedIn: { bool: false }, user: null, userProfile: null };
    }
});


export const userSlice=createSlice({
    name:'User',
    initialState,
    reducers:{
        login:(state,action)=>login1(state,action),
        logout:(state,action)=>{
            state.user=undefined;
            state.isLoggedIn = { bool: false };
            state.userProfile = null;
            localStorage.removeItem('User');
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isLoggedIn = action.payload.isLoggedIn;
                state.user = action.payload.user;
                state.userProfile = action.payload.userProfile;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isLoggedIn = { bool: false };
                state.user = null;
                state.userProfile = null;
            })

    }
})
export const {login,logout} = userSlice.actions;
export default userSlice.reducer