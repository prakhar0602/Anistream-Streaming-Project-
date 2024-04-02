import { configureStore } from "@reduxjs/toolkit";
import local_data from './local_data_Slice'
import episode from './episodeSlice'
import User from './userSlice'
export const store=configureStore({
    reducer:{
    local:local_data,
    episode:episode,
    user:User
    }
})