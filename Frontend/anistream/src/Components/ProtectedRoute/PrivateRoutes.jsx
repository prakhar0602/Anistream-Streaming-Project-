import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({children}) => {
  let user=useSelector(state=>state.user.user)
    return user?(user.type=='admin' ? children : <Navigate to='/'/>):(<Navigate to='/login'/>)
}

export default PrivateRoutes