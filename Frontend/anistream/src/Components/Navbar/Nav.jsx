import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
// import './Nav.css'
import {Link} from 'react-router-dom'
const Nav = () => {
    let user=useSelector(state=>state.user.user)
    let [menuOpen,setMenuOpen]=useState(false)
    useEffect(()=>{
        console.log(user)
    },[user])
  return (
    <div className="bg-black/30 flex lg:flex-row flex-col lg:w-full lg:justify-around items-center p-2 gap-3 xl:fixed z-40 top-0">
        <div className='flex justify-between w-full lg:w-fit items-center'>
        <div className="flex item-center lg:gap-5 gap-3">
            <img className='lg:h-16 h-14' src="src\Assets\icon.png" alt="Icon" />
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
            <input className='outline-none text-lg xl:text-2xl py-2 pl-3 pr-11 w-full lg:w-fit text-white bg-white/30 rounded-3xl ' type="text" />
            <button className='flex text-3xl text-white -ml-9 p-2 bg-black items-center rounded-r-3xl'><ion-icon name="arrow-forward"></ion-icon></button>
            </form>
            <Link to='/dashboard' className='text-white font-arial flex bg-gradient-to-r from-[#be51caac] to-[#763eb9a7] p-2 rounded-3xl hover:bg-gradient-to-r hover:from-[#be51ca] hover:to-[#753eb9] m-1'><p className='text-2xl m-0'><ion-icon name="person"></ion-icon><p className='hidden xl:inline'>{user?(user.username):('')}</p></p></Link>
        </div>
    </div>
  )
}

export default Nav