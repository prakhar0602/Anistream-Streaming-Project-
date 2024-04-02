import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../Assets/loading....gif'
import {logout} from '../../Redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
let a=import.meta.env
const Dashboard = () => {
  let [isLoading,setLoading]=useState(false)
  let dispatch=useDispatch()
  let user=useSelector(state=>state.user.user)
  async function logout1(){
    setLoading(true)
    await dispatch(logout())

    setLoading(false)
  }
  return (
    <div className="flex w-full justify-center items-center h-screen m-auto">
        {
          !user?(<div className="flex gap-10 w-full justify-center">
            <Link to="/login" className="bg-[#9134ef] hover:bg-[#8142bf] text-4xl font-mono rounded-lg text-white p-5">
          Login
        </Link>
        <Link to="/signup" className="bg-[#9134ef] hover:bg-[#8142bf] text-4xl font-mono rounded-lg text-white p-5">
          Signup
        </Link>
          </div>)
          :
        (
          <Link onClick={()=>logout1()} className="bg-[#9134ef] hover:bg-[#8142bf] text-4xl font-mono rounded-lg text-white p-5">
          {
            isLoading?(<img className='w-14' src={logo}/>):(<span>Logout</span>)
          }
        </Link>
        )
      }
    </div>
  )
}

export default Dashboard
