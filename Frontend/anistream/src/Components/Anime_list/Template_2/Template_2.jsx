import React from 'react'
import image from '../../../Assets/test.jpg'
import {Link, useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { select } from '../../../Redux/local_data_Slice';
import axios from 'axios';
import { set_Episode } from '../../../Redux/episodeSlice';
const {VITE_BACKEND_LINK}=import.meta.env
// import './template.css'
const Template_2 = (props) => {
    let name=props.series.name;
    let type="Series"
    let avg_rating=props.series.avg_rating
    let desc=props.series.desc;
    let dispatch=useDispatch()
    let navigate=useNavigate()
  async function setAnime(e){
    e.preventDefault()
    let x=props.series;
    await dispatch(select(x))
    navigate('/view')
  }
  async function setEpisode(e){
     e.preventDefault();
    let id=props.series.episodes[0]
    let response=await axios.get(`${VITE_BACKEND_LINK}/get_file_code/${id}`)
    response=response.data;
    console.log(response)
    let a = {
      index: 0,
      fld_id: props.series.fld_id,
      file_code: response,
    };
    await dispatch(set_Episode(a));
    navigate("/episode-view");
  }
  return (
    <div className='bg-[#573087] min-w-[358.4px] flex xl:flex-row  items-center p-4 flex-col lg:p-8  rounded-xl gap-8'>
        <img src={props.series.big_image} className='lg:w-[540px] w-[300px] h-[200px] xl:h-auto rounded-xl shadow-[10px_10px_10px_rgba(0,0,0,0.4)]' alt="" />
        <div className="flex flex-col justify-around text-white">
            <h1 className='m-2 xl:text-4xl text-2xl lg:w-full w-[310.4px] xl:h-auto h-[96px] flex   xl:font-bold font-medium '>{name}</h1>
            <p className='m-2 lg:text-2xl text-xl font-medium'>{type}</p>
            <h3 className='m-2 xl:text-2xl text-lg '>{avg_rating}/10</h3>
            <p className='m-2 xl:m-0 xl:h-fit xl:w-fit h-[144px] w-[310px] text-ellipsis overflow-hidden'>{desc}</p>
            <div className="flex justify-center lg:justify-start lg:mt-2">
                <Link className='hover:bg-gradient-to-r text-white from-[#be51ca] to-[#753eb9] inline m-2 ml-3 py-2.5 lg:px-6 px-3 rounded-3xl bg-gradient-to-r hover:from-[#a448ae] hover:to-[#5c3290]' onClick={(e)=>setEpisode(e)}><p className='lg:text-md text-sm'> Watch Episode 1</p></Link>
                <Link className='hover:bg-gradient-to-r text-white from-[#be51ca] to-[#753eb9] inline m-2 ml-3 py-2.5 lg:px-6 px-3 rounded-3xl bg-gradient-to-r hover:from-[#a448ae] hover:to-[#5c3290]' onClick={(e)=>setAnime(e)}><p className='lg:text-md text-sm'>All Episodes</p></Link>
            </div>
        </div>
    </div>
  )
}

export default Template_2