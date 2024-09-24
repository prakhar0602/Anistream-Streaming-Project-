import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import Template from '../Anime_list/Template/Template';
import { select } from '../../Redux/local_data_Slice';

const Results = () => {
    let results = useSelector((state)=>state.local.query_results);
    let dispatch = useDispatch()
  return (
    <div className='flex flex-col lg:px-12 lg:py-24 p-14 text-white font-semibold '>
        <p className='m-0 p-0 text-2xl text-center'>Results</p>
        <div className="px-5 mb-14">
          <p className='lg:text-3xl text-2xl lg:mb-4 mb-2'>Anime Series</p>
          <div className='flex gap-5 max-w-full w-full h-fit p-4 no-scrollbar overflow-x-scroll overflow-auto'>
          {
            
            results.series.map((s,index)=>(
              <Link to="/view" onClick={()=>dispatch(select(s))}><Template series={s} key={s.fld_id}/></Link>
              ))
            }
        </div>
      </div>
      <div className="px-5"> 
          <p className='lg:text-3xl text-2xl lg:mb-4 mb-2'>Anime Movies</p>
          <div className='flex gap-5 max-w-full w-full h-fit p-4 no-scrollbar overflow-x-scroll overflow-auto'>
          {
            
            results.movies.map((s,index)=>(
              <Link to="/view" onClick={()=>dispatch(select(s))}><Template series={s} key={s.fld_id}/></Link>
              ))
            }
        </div>
      </div>
    </div>
  )
}

export default Results