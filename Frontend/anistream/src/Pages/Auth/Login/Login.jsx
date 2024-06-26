import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { signIn } from '../../../firebase/auth'
import { login } from '../../../Redux/userSlice'
import { Link, useNavigate } from 'react-router-dom'
import logo1 from '../../../Assets/loading....gif'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// import Cookies from 'js-cookie'
const {VITE_BACKEND_LINK}=import.meta.env
const Login = () => {
    let [email,setEmail]=useState('')
    let [password,setPassword]=useState('')
    let [isLoading,setLoading]=useState(false)
    let navigate=useNavigate()
    let dispatch=useDispatch()
      function changeEmail(e){
        setEmail(e.target.value)
      }
      function changePassword(e){
        setPassword(e.target.value)
      }
      useEffect(()=>{
        // console.log(Cookies.get())
       },[])
      async function showToast(){
        await toast.success('Login Successfull',{
          position: "top-center",
        })
      }
      async function handleSubmit (e){
          setLoading(true)
            e.preventDefault();
            try{
              let uid=(await signIn(email,password)).user.uid;
              let response=await axios.get(`${VITE_BACKEND_LINK}/login/${uid}`,{
              withCredentials:true
            });
            response=(response.data)
            localStorage.setItem('Expiry',response.expires)
            dispatch(login(response.users))

            await showToast();
            }
            catch(e){
              console.log(e.message)
              await toast.error('Wrong Credentials',{
                position:'top-center'
              })
            }finally{
             setLoading(false)
            }
            // console.log(toast)
            navigate('/')
        }
      return (
        <div className='w-full min-h-screen flex items-center'>
          
          <div className="flex flex-col items-center xl:w-50 w-[90%] sm:w-fit   my-auto mx-auto xl:p-20 sm:p-14 p-5 shadow-xl rounded-xl bg-black/25">
          <h2 className="text-center mb-7 text-white text-3xl font-bold w-fit">Log In</h2>
          <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col sm:w-72 w-full">
            <div className='flex justify-between w-full items-center'>
            <label className="mb-2 text-white "> Email:
            </label>
              <input className='sm:p-3 p-2 w-[70%]  mb-3 outline-none bg-white/20 text-white' type="email" name="email" onChange={changeEmail} required />
            </div>
            <div className='flex justify-between w-full items-center'>
            <label className="mb-2 text-white"> Password:
            </label>
              <input type="password" name="password" onChange={changePassword} className="sm:p-3 p-2 w-[70%]  mb-3 outline-none bg-white/20 text-white" required />
            </div>
            <button type="submit" className="bg-[#9134ef] hover:bg-[#8142bf] flex justify-center text-white rounded-2xl p-2 mt-5">
              {
                isLoading?
                (<img className='w-14 h-[40px]' src={logo1} />):(<span>Login</span>)
              }
            </button>
          </form>
              <Link to='/signup' className="bg-[#9134ef] hover:bg-[#8142bf] flex justify-center text-white rounded-2xl p-2 mt-5">SignUp</Link>
        </div>
        </div>
      );
}

export default Login