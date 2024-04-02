import React, { useEffect, useLayoutEffect, useState } from 'react'
import { check_user } from '../../Redux/userSlice';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    let [redirect,setRedirect]=useState(true)
    useEffect(()=>{
        async function ab(){
            let a=localStorage.getItem('Expiry') || 0
            if(a<Date.now())
           await setRedirect(false);
        }
        ab()
    },[])
    return redirect ? children : <Navigate to='/login' />
}

export default ProtectedRoutes