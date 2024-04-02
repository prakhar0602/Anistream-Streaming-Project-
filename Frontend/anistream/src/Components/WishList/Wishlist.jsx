import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Template_2 from '../Anime_list/Template_2/Template_2'
import Template_4 from '../Anime_list/Template_4/Template_4'

const Wishlist = () => {
  let [series,setSeries]=useState([])
  let [movies,setMovies]=useState([])
  let [update,setUpdate]=useState(false)
  useEffect(()=>{
    async function ab(){
      // console.log(user.wishlist)
      let response=await axios.post('http://localhost:8080/get_wishlist',{id:JSON.parse(localStorage.getItem('User'))});
      response=response.data;
      console.log(response)
      await setSeries(response.series)
      await setMovies(response.movies)
    }
    ab()
  },[update])
  return (
    <div className='w-screen min-h-screen flex justify-center items-center flex-col gap-5 py-28 lg:px-24'>
      <h1 className='text-white text-4xl font-bold'>WishList</h1>
      <div className='flex flex-col'>
        <h2 className='text-white text-2xl font-medium mb-5 lg:ml-0 ml-5 '>Series</h2>
      <div className='flex lg:flex-col lg:gap-8 gap-2 w-screen overflow-scroll no-scrollbar p-4 lg:p-0'>

      {
        series.map((s,index)=>(
          <Template_4 series={s} key={index} update={update} setUpdate={setUpdate}/>
          ))
        }
        </div>
      </div>
      <div className='flex flex-col'>
        <h2 className='text-white text-2xl font-medium mb-5 lg:ml-0 ml-5'>Movies</h2>
        <div className='flex lg:flex-col lg:gap-8 gap-2 w-screen lg:w-auto overflow-scroll no-scrollbar p-4 lg:p-0'>
      {

            movies.map((s,index)=>(
              <Template_4 series={s} key={index} update={update} setUpdate={setUpdate}/>
            ))
        }
        </div>
      </div>
    </div>
  )
}

export default Wishlist