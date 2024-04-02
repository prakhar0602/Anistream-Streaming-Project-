import React, { useEffect, useLayoutEffect, useState } from 'react'
import { check_user } from '../../Redux/userSlice';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    let [redirect,setRedirect]=useState(true)
    useEffect(()=>{
        async function ab(){
            let a=await check_user()
           await setRedirect(a);
        }
        ab()
    },[])
    return redirect ? children : <Navigate to='/login' />
}

export default ProtectedRoutes