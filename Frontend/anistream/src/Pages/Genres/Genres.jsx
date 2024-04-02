import React, { useEffect } from 'react'
import { check_user } from '../../Redux/userSlice'
import { useNavigate } from 'react-router-dom'

const Genres = () => {
  let navigate=useNavigate()
  useEffect(()=>{
    async function ab(){
      if(!await check_user())
        navigate('/login')
    }
  })
  return (
    <div>Genres</div>
  )
}

export default Genres