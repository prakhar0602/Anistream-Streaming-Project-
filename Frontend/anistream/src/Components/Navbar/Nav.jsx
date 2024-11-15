import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import logo from '../../Assets/icon.png'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { setResults } from '../../Redux/local_data_Slice'
const {VITE_BACKEND_LINK} = import.meta.env
const Nav = () => {
    let user=useSelector(state=>state.user.user)
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let [query,setQuery]=useState('')
    let [menuOpen,setMenuOpen]=useState(false)
    useEffect(()=>{
    },[user])
    async function search(){
        let results = await axios.get(`${VITE_BACKEND_LINK}/search/${query}`)
        if(results.data.bool){
            dispatch(setResults(results.data.results))
            navigate('/results');
        }
        else{
            toast.warning("Something went wrong",{position:"bottom-right"})
        }

    }
  return (
    <div className="bg-black/30 flex lg:flex-row flex-col lg:w-full lg:justify-around items-center p-2 gap-3 xl:fixed z-40 top-0 ">
        <div className='flex justify-between w-full lg:w-fit items-center'>
        <div className="flex item-center lg:gap-5 gap-3">
            <img className='lg:h-16 h-14' src={logo} alt="Icon" />
            <p className='lg:font-extrabold xl:text-4xl font-bold text-3xl text-white m-0 flex items-center'>Anistream</p>
        </div>
        <div className='lg:hidden'>
            <button onClick={()=>{setMenuOpen(!menuOpen)}}>
                <p className='text-white text-4xl'>
        <ion-icon name="menu"></ion-icon>
            </p>
                </button>
        </div>
        </div>
        <div className={`lg:flex ${menuOpen?'flex' : 'hidden'} `}>
            <ul className='list-none flex'>
                <li className='hover:bg-gradient-to-r text-white hover:from-[#be51ca] hover:to-[#753eb9] inline mr-2 ml-3 py-2.5 lg:px-6 px-4 rounded-3xl bg-gradient-to-r from-[#be51caac] to-[#763eb9a7]'><Link to='/'>Home</Link></li>
                <li className='hover:bg-gradient-to-r text-white hover:from-[#be51ca] hover:to-[#753eb9] inline mr-2 ml-3 py-2.5 lg:px-6 px-4 rounded-3xl bg-gradient-to-r from-[#be51caac] to-[#763eb9a7]'><Link to='/genres'>Genre</Link></li>
                {
                    user && user.type=='admin'?(
                    <li className='hover:bg-gradient-to-r text-white hover:from-[#be51ca] hover:to-[#753eb9] inline mr-2 ml-3 py-2.5 lg:px-6 px-4 rounded-3xl bg-gradient-to-r from-[#be51caac] to-[#763eb9a7]'><Link to='/new'>New</Link></li>
                    ):(<span></span>)
                }
                <li className='hover:bg-gradient-to-r text-white hover:from-[#be51ca] hover:to-[#753eb9] inline mr-2 ml-3 py-2.5 lg:px-6 px-4 rounded-3xl bg-gradient-to-r from-[#be51caac] to-[#763eb9a7]'><Link to='/wishlist' className='text-xl text-blue-300'><ion-icon name="bookmark"></ion-icon></Link></li>
            </ul>
        </div>
        <div className={`${menuOpen?'flex' : 'hidden'} lg:flex gap-5 w-full lg:w-fit lg:gap-10 items-center flex-col lg:flex-row`}>
            <form className='flex w-full lg:w-fit' action="">
            <input onChange={(e)=>setQuery(e.target.value)} className='outline-none text-lg xl:text-2xl py-2 pl-3 pr-11 w-full lg:w-fit text-white bg-white/30 rounded-3xl ' type="text" />
            <button type="button" onClick={()=>search()} className='flex text-3xl text-white -ml-9 p-2 bg-black items-center rounded-r-3xl'><ion-icon name="arrow-forward"></ion-icon></button>
            </form>
            <Link to='/dashboard' className='text-white font-arial flex bg-gradient-to-r from-[#be51caac] to-[#763eb9a7] p-2 rounded-3xl hover:bg-gradient-to-r hover:from-[#be51ca] hover:to-[#753eb9] m-1'><p className='text-2xl m-0'><ion-icon name="person"></ion-icon><p className='hidden xl:inline'>{user?(user.username):('')}</p></p></Link>
        </div>
    </div>
  )
}

export default Nav