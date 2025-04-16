import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import axios from 'axios';
const {VITE_BACKEND_LINK} = import.meta.env
const ProtectedRoutes = ({children}) => {
    let [redirect,setRedirect]=useState(true)
    useEffect(()=>{
        async function ab(){
            let response=await axios.get(`${VITE_BACKEND_LINK}/verify_token`,{withCredentials:true})
            response=response.data.bool
            if(!response){
           await setRedirect(false);}
        }
        ab()
    },[])
    return redirect ? children : <Navigate to='/login' />
}

export default ProtectedRoutes