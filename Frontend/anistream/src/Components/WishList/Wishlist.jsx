import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Template from '../Anime_list/Template/Template'
const {VITE_BACKEND_LINK}=import.meta.env
const Wishlist = () => {
  let [series,setSeries]=useState([])
  let [movies,setMovies]=useState([])
  let [update,setUpdate]=useState(false)
  let [loading,setLoading]=useState(true)
  let [error,setError]=useState(null)
  
  useEffect(()=>{
    async function fetchWishlist(){
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('User'))
        if (!user) {
          setError('Please login to view your wishlist')
          return
        }
        
        let response = await axios.post(`${VITE_BACKEND_LINK}/get_wishlist`, {
          id: user._id
        }, {
          withCredentials: true
        })
        
        response = response.data
        setSeries(response.series || [])
        setMovies(response.movies || [])
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        setError('Failed to load wishlist')
      } finally {
        setLoading(false)
      }
    }
    fetchWishlist()
  },[update])
  if (loading) {
    return (
      <div className='text-white pb-32 min-h-screen flex justify-center items-center'>
        <div className='text-xl'>Loading your wishlist...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='text-white pb-32 min-h-screen flex justify-center items-center'>
        <div className='text-red-400 text-xl'>{error}</div>
      </div>
    )
  }

  return (
    <div className='text-white pb-32'>
      <div className='lg:px-10 lg:py-7 p-5'>
        <h1 className='lg:text-4xl text-3xl lg:mb-7 mb-4 font-funky flex items-center gap-3'>
          <span>💖</span>
          My Wishlist
        </h1>
        
        {series.length === 0 && movies.length === 0 ? (
          <div className='text-center py-20'>
            <div className='text-6xl mb-4'>📝</div>
            <h2 className='text-white text-2xl mb-4'>Your wishlist is empty</h2>
            <p className='text-gray-400'>Start adding anime to your wishlist to see them here!</p>
          </div>
        ) : (
          <>
            {series.length > 0 && (
              <div className='lg:px-10 lg:py-7 p-5'>
                <p className='lg:text-3xl text-2xl lg:mb-7 mb-4 font-funky'>Anime Series ({series.length})</p>
                <div className='flex gap-3 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-y-hidden'>
                  {series.map((s,index)=>(
                    <Template series={s} key={s._id || index}/>
                  ))}
                </div>
              </div>
            )}
            
            {movies.length > 0 && (
              <div className='lg:px-10 lg:py-7 p-5'>
                <p className='lg:text-3xl text-2xl lg:mb-7 mb-4 font-funky'>Anime Movies ({movies.length})</p>
                <div className='flex gap-3 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-y-hidden'>
                  {movies.map((s,index)=>(
                    <Template series={s} key={s._id || index}/>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Wishlist