import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import axios from 'axios';
const {VITE_BACKEND_LINK} = import.meta.env
const ProtectedRoutes = ({children}) => {
    let [isAuthenticated, setIsAuthenticated] = useState(null)
    useEffect(()=>{
        async function checkAuth(){
            try {
                let response = await axios.get(`${VITE_BACKEND_LINK}/verify_token`, {withCredentials:true})
                setIsAuthenticated(response.data.bool)
            } catch (error) {
                setIsAuthenticated(false)
            }
        }
        checkAuth()
    },[])
    
    if (isAuthenticated === null) return <div>Loading...</div>
    return isAuthenticated ? children : <Navigate to='/login' />
}

export default ProtectedRoutes