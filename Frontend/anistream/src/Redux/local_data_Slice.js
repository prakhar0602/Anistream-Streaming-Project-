import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axios from 'axios';

const {VITE_BACKEND_LINK}=import.meta.env
function load_data(){
    if(localStorage.getItem('local_data'))
        return JSON.parse(localStorage.getItem('local_data'))
    return {
            series:[],
            movies:[],
            trending:[],
            popular:[],
            most_latest:null,
            selected_anime:null,
            query_results:null
    }
}

let initialState=load_data();


// Defining the selected Anime
function set_selected(state,action){
    state.selected_anime=action.payload;
    localStorage.setItem('local_data',JSON.stringify(state))
}
function set_results(state,action){
    state.query_results=action.payload;
    localStorage.setItem('local_data',JSON.stringify(state))
}
export const update_selected=createAsyncThunk('update_selected',async(dt)=>{
    let id=dt.id
    let type=dt.type
    let response=await axios.get(`${VITE_BACKEND_LINK}/get_updated_series/${type}/${id}`)
    return response.data.e;
})

export const set_local_data1=createAsyncThunk("set_local_data1",async()=>{
    let data={
        series:[],
        movies:[],
        trending:[],
        popular:[]
    }
    let response=await axios.get(`${VITE_BACKEND_LINK}/get_series`);
    data.series=response.data;
    response=await axios.get(`${VITE_BACKEND_LINK}/get_movies`);
    data.movies=response.data;
    return data;
})

export const localSlice=createSlice({
    name:'local_data',
    initialState,
    reducers:{
        select:(state,action)=>set_selected(state,action),
        setResults:(state,action)=>set_results(state,action)
    },
    extraReducers:(builder)=>{
        builder.addCase(set_local_data1.fulfilled,(state,action)=>{
            state.series=action.payload.series
            state.movies=action.payload.movies
            state.most_latest=action.payload.series[action.payload.series.length-1]
        })
        builder.addCase(update_selected.fulfilled,(state,action)=>{
            state.selected_anime=action.payload
        })

    }
})

export const{select,setResults}=localSlice.actions
export default localSlice.reducer