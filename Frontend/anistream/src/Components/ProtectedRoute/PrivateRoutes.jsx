import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const {VITE_BACKEND_LINK} = import.meta.env
const PrivateRoutes = ({children}) => {
    const [redirect,setRedirect] = useState(false)
    useEffect(()=>{
      async function checkLogin(){
        const response = await axios.get(`${VITE_BACKEND_LINK}/verify_token`,{
          withCredentials:true
        })
        if(response.data.bool)
          setRedirect(true);
      }
      checkLogin();
    },[])
    return redirect ?  <Navigate to='/'/> : children ;
}

export default PrivateRoutes