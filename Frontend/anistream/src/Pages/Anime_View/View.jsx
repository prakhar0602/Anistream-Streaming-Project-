import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from '../../Assets/loading.gif' 
import Template from '../../Components/Anime_list/Template/Template';
import Template_3 from '../../Components/Anime_list/Template_3/Template_3';
import Main_Anime_2 from '../../Components/Anime_list/Main_Anime_2/Main_Anime_2';

import axios from 'axios';
const {VITE_BACKEND_LINK}=import.meta.env
const View = () => {
    const { id } = useParams();

    const [data, setData] = useState(null)
    const [allEpisodes,setAllEpisodes]=useState([])
    const [seasons,setSeasons]=useState([])
    const [selectedSeason,setSelectedSeason]=useState(0)
    const [selectedEpisodes,setSelectedEpisodes]=useState([])
    const [open,isOpen]=useState(false)
    const [isLoading,setLoading]=useState(true)
    const navigate=useNavigate()
    
    useEffect(()=>{
      fetchAnimeData()
    },[id])
    
    const fetchAnimeData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${VITE_BACKEND_LINK}/anime/${id}`)
        const animeData = response.data
        setData(animeData)
        
        if(animeData?.seasons && animeData.seasons.length > 0) {
          setSeasons(animeData.seasons)
          setSelectedSeason(0)
          setSelectedEpisodes(animeData.seasons[0].episodes || [])
          
          let allEps = []
          animeData.seasons.forEach(season => {
            if(season.episodes) {
              allEps.push(...season.episodes)
            }
          })
          setAllEpisodes(allEps)
        }
        
        // Add viewed record
        try{
          await axios.post(`${VITE_BACKEND_LINK}/add_viewed`, {
            animeId: animeData._id,
            animeModel: animeData.type === 's' ? 'Series' : 'Movies'
          },{
            withCredentials:true
          });
        } catch(e) {
          console.log('Failed to add viewed record:', e);
        }
        
        setLoading(false)
      } catch (error) {
        console.log('Failed to fetch anime:', error)
        setLoading(false)
      }
    }
    function changeSeason(seasonIndex){
      if(seasons[seasonIndex]) {
        setSelectedSeason(seasonIndex)
        setSelectedEpisodes(seasons[seasonIndex].episodes || [])
        isOpen(false)
      }
    }
    async function select_Episode(e,episodeIndex){
      e.preventDefault()
      const episode = selectedEpisodes[episodeIndex]
      if (episode && data) {
        navigate(`/episode-view/${data._id}/${episode._id}`)
      }
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
        <div className="lg:w-[95%] ml-[23px] w-full">
          {seasons.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {seasons.map((season, index) => (
                <button
                  key={index}
                  onClick={() => changeSeason(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedSeason === index 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {season.name || `Season ${index + 1}`}
                </button>
              ))}
            </div>
          )}
          
          <div className="grid lg:grid-cols-3 grid-cols-2 gap-y-10">
            {
              selectedEpisodes.map((episode,index)=>(
                <button key={index} onClick={(e)=>select_Episode(e,index)} className="w-full">
                  <Template_3 series={{name:`Episode ${index+1}`,cover_image:episode?.snap_link || ''}}/>
                </button>
              ))
            }
          </div>
        </div>
            </div>
    </div>)}
    </div>
  )
}

export default View