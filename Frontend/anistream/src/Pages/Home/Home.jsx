import React, { useEffect, useState } from 'react'
import Main_Anime from '../../Components/Anime_list/Main_Anime/Main_Anime'
import Template from '../../Components/Anime_list/Template/Template'
import Template_2 from '../../Components/Anime_list/Template_2/Template_2'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { set_local_data1 } from '../../Redux/local_data_Slice'
import { select } from '../../Redux/local_data_Slice'
import logo from '../../Assets/loading.gif'
const Home = () => {

  let dispatch=useDispatch();
  let [isLoading,setLoading]=useState(true)
  let {series,movies,most_latest}=useSelector(state=>state.local)
  
  useEffect(()=>{
    async function ab(){
      await dispatch(set_local_data1())
      setLoading(false)
    }
    ab()
  },[]) 
  return (
    <div className='text-white'>
      {
    isLoading?
    (<div className='w-full h-screen flex justify-center items-center'><img className='w-28' src={logo} />Loading</div>):(
      <div>
      {
        most_latest?(
          <Main_Anime x={most_latest}/>
          ):(<p></p>)
        }
        <div className="lg:px-12 lg:py-7 p-5">
          <p className='lg:text-3xl text-2xl lg:mb-8 mb-4'>Anime Series</p>
          <div className='flex gap-5 max-w-full w-full h-fit p-4 no-scrollbar overflow-x-scroll overflow-auto'>
          {
            
            series.map((s,index)=>(
              <Link to="/view" onClick={()=>dispatch(select(s))}><Template series={s} key={s.fld_id}/></Link>
              ))
            }
        </div>
      </div>
      <div className="lg:p-12 p-5"> 
          <p className='lg:text-3xl text-2xl lg:mb-8 mb-4'>Anime Movies</p>
          <div className='flex gap-5 max-w-full w-full h-fit p-4 no-scrollbar overflow-x-scroll overflow-auto'>
          {
            
            movies.map((s,index)=>(
              <Link to="/view" onClick={()=>dispatch(select(s))}><Template series={s} key={s.fld_id}/></Link>
              ))
            }
        </div>
      </div>
      <div className="lg:p-12 p-5">
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
      </div>
    </div>
  )
  }
            </div>
  )
}

export default Home