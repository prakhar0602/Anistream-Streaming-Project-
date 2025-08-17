import React, { useEffect, useState } from 'react'
import Main_Anime from '../../Components/Anime_list/Main_Anime/Main_Anime'
import Template from '../../Components/Anime_list/Template/Template'
import Template_2 from '../../Components/Anime_list/Template_2/Template_2'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { set_local_data1 } from '../../Redux/local_data_Slice'
import { select } from '../../Redux/local_data_Slice'
import Genre from '../../Components/Genre_Template/Genre'
import axios from 'axios'
const Home = () => {
  const {VITE_BACKEND_LINK}=import.meta.env
  let dispatch=useDispatch();
  let {series,movies,most_latest}=useSelector(state=>state.local)
  const [recommendations, setRecommendations] = useState([])
  
  useEffect(()=>{
    dispatch(set_local_data1())
    fetchRecommendations()
  },[])
  
  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`${VITE_BACKEND_LINK}/recommendations`, {
        withCredentials: true
      })
      if(response.data.bool) {
        setRecommendations(response.data.recommendations)
      }
    } catch (error) {
      console.log('Failed to fetch recommendations:', error)
    }
  } 
  return (
    <div className='text-white pb-32'>
      <div>
      {
        most_latest?(
          <Main_Anime x={most_latest}/>
          ):(<p></p>)
        }
        {recommendations.length > 0 && (
          <div className="lg:px-10 lg:py-7 p-5">
            <p className='lg:text-3xl text-2xl lg:mb-7 mb-4 font-funky'>Recommended for You</p>
            <div className='flex gap-3 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-auto'>
            {
              recommendations.map((s,index)=>(
                <Link key={s._id} to="/view" onClick={()=>dispatch(select(s))}>
                  <Template series={s}/>
                </Link>
                ))
              }
          </div>
        </div>
        )}
        
        {series && series.length > 0 && (
          <div className="lg:px-10 lg:py-7 p-5">
            <p className='lg:text-3xl text-2xl lg:mb-7 mb-4 font-funky'>Trending</p>
            <div className='flex gap-3 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-auto'>
            {
              series.map((s,index)=>(
               <Template series={s} key={s.fld_id}/>
                ))
              }
          </div>
        </div>
        )}
        {series && series.length > 0 && (
          <div className="lg:px-10 lg:py-7 p-5">
            <p className='lg:text-3xl text-2xl lg:mb-7 mb-4'>Popular Animes</p>
            <div className='flex gap-3 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-auto'>
            {
              [...series].sort((a, b) => (b.avg_rating || 0) - (a.avg_rating || 0)).map((s,index)=>(
                <Link to="/view" onClick={()=>dispatch(select(s))}><Template series={s} key={s.fld_id}/></Link>
                ))
              }
          </div>
        </div>
        )}

      <div className="lg:px-10 lg:py-7 p-5">
          <p className='lg:text-3xl text-2xl lg:mb-7 mb-4'>Popular Genres</p>
          <div className='flex gap-3 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-auto'>
          {
            ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy'].map((genre, index) => (
              <Link key={index} to={`/genres/${genre}`}>
                <Genre 
                  title={genre} 
                  image={`${['https://res.cloudinary.com/jerrick/image/upload/c_scale,f_jpg,q_auto/lgi39qi7kmzdipemivm1.jpg',
       'https://static.toiimg.com/thumb/msid-108812406,width-1280,height-720,resizemode-4/108812406.jpg',
       'https://cms.animecollective.com/wp-content/uploads/2023/04/best-comedy-anime-sket-dance.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlH0Ymm-2VpaEo_7DM7GAm2OU9IRDUqPbszQ&s',
      'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/the-greatest-fantasy-anime-of-all-time-december-2024.jpg?q=70&fit=contain&w=1200&h=628&dpr=1']
      [index]}?w=400`} 
                />
              </Link>
            ))
          }
        </div>
      </div>


        {series && series.length > 0 && (
          <div className="lg:px-10 lg:py-7 p-5">
            <p className='lg:text-3xl text-2xl lg:mb-7 mb-4'>Anime Series</p>
            <div className='flex gap-3 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-auto'>
            {
              series.map((s,index)=>(
                <Link to="/view" onClick={()=>dispatch(select(s))}><Template series={s} key={s.fld_id}/></Link>
                ))
              }
          </div>
        </div>
        )}
        {movies && movies.length > 0 && (
          <div className="lg:px-10 lg:py-7 p-5"> 
            <p className='lg:text-3xl text-2xl lg:mb-7 mb-4'>Anime Movies</p>
            <div className='flex gap-3 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-auto'>
            {
              movies.map((s,index)=>(
                <Link to="/view" onClick={()=>dispatch(select(s))}><Template series={s} key={s.fld_id}/></Link>
                ))
              }
          </div>
        </div>
        )}
      {/* <div className="lg:p-12 p-5">
          <p className='lg:text-3xl text-2xl lg:mb-8 mb-4'>Trending</p>
          <div className='flex xl:flex-col overflow-scroll no-scrollbar gap-8 lg:p-4 p-1 lg:mx-8 mx-3'>
          {
            series.map((s,index)=>(
              <Template_2 series={s} key={s.fld_id}/>
              ))
            }
        </div>
      </div>
      <div className="lg:p-12 p-5">
          <p className='lg:text-3xl text-2xl lg:mb-8 mb-4'>Popular</p>
          <div className='flex gap-5 p-4 max-w-full w-full h-fit no-scrollbar overflow-x-scroll overflow-auto'>
          {
            
            series.map((s,index)=>(
              <Link to="/view" onClick={()=>dispatch(select(s))}><Template series={s} key={s.fld_id}/></Link>
              ))
            }
        </div>
      </div> */}
    </div>
            </div>


  // <div>
  //   {
  //     series.map((x,i)=>(
  //       <Template series={x}/>
  //     ))
  //   }
  // </div>
  )
}

export default Home