import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../Assets/loading.gif' 
import Template from '../../Components/Anime_list/Template/Template';
import { useDispatch, useSelector } from 'react-redux';
import Template_3 from '../../Components/Anime_list/Template_3/Template_3';
import Main_Anime_2 from '../../Components/Anime_list/Main_Anime_2/Main_Anime_2';
import { set_Episode } from '../../Redux/episodeSlice';
const View = () => {
    let dispatch=useDispatch();
    let data=useSelector(state=>state.local.selected_anime)
    let [files,setFiles]=useState([])
    let [seasons,setSeasons]=useState([])
    let [selectedfiles,setSelectFiles]=useState([])
    let [open,isOpen]=useState(false)
    let [isLoading,setLoading]=useState(true)
    let [preNEp,setPren]=useState(0)
    let navigate=useNavigate()
    useEffect(()=>{
      async function ab(){
        
        setFiles(data.episodes)
        let n=data.nseasons.split(' ')
        setSeasons(n)
        n=Number(n[0])
        let b=[]
        for(let i=0;i<n;i++)
        b.push(data.episodes[i])
        setSelectFiles(b)
        console.log(b)
        setLoading(false)
      }
        ab();
    },[])
    function changeSeason(n){
      let s=0
      for(let i=0;i<n-1;i++)
      s+=Number(seasons[i])
      setPren(s)
      let l
      if(seasons[n-1]<0)
      l=s+(Number(seasons[n-1])*-1)
      else
      l=s+Number(seasons[n-1])
      let b=[]
      for(let i=s;i<l;i++)
      b.push(files[i])
      setSelectFiles(b)
      isOpen(false)
    }
    async function select_Episode(e,ind){
      e.preventDefault()
      let a={
        index:ind+preNEp,
        files,
      }
      console.log(a)
      dispatch(set_Episode(a));
      navigate('/episode-view')
    }
    function changeopen(){
      if(open){
        isOpen(false)
      }
      else{
        isOpen(true)
      }
    }
  return (
    <div>
      {
          isLoading?(<div className="h-screen w-full flex justify-center items-center text-white">
           <img src={logo} className="w-32" alt="" /> <p className="text-xl ">Loading</p>
            </div>
            ):(
    <div className='w-full pb-14'>
        <Main_Anime_2 x={data}/>
        <div className=' overflow-hidden w-full flex justify-center items-center pt-14'>
        <div className="lg:w-[95%] ml-[23px] w-full grid lg:grid-cols-3 grid-cols-2 gap-y-10">
          {
            selectedfiles.map((f,index)=>(
              <Link onClick={(e)=>select_Episode(e,index)}>
              <Template_3 series={{name:`Episode ${index+1}`,cover_image:f.snap_link}}/>
              </Link>
              ))
            }
        </div>
            </div>
    </div>)}
    </div>
  )
}

export default View