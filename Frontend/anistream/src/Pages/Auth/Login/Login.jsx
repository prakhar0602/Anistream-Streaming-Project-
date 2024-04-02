import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { signIn } from '../../../firebase/auth'
import { login } from '../../../Redux/userSlice'
import { useNavigate } from 'react-router-dom'
import logo1 from '../../../Assets/loading....gif'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
              let response=await axios.get(`http://localhost:8080/login/${uid}`,{
              withCredentials:true
            });
            response=(response.data)[0]
            dispatch(login(response))
            await showToast();
            }
            catch(e){
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
        <div className='w-full min-h-screen flex items-start'>
          
          <div className="xl:w-50  my-auto mx-auto xl:p-20 p-14 shadow-xl rounded-xl bg-black/25">
          <h2 className="text-center mb-7 text-white text-3xl font-bold">Log In</h2>
          <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col w-72">
            <div className='flex justify-between w-full items-center'>
            <label className="mb-2 text-white "> Email:
            </label>
              <input className='p-3 mb-3 outline-none bg-white/20 text-white' type="email" name="email" onChange={changeEmail} required />
            </div>
            <div className='flex justify-between w-full items-center'>
            <label className="mb-2 text-white"> Password:
            </label>
              <input type="password" name="password" onChange={changePassword} className="p-3 outline-none mb-3 bg-white/20 text-white" required />
            </div>
            <button type="submit" className="bg-[#9134ef] hover:bg-[#8142bf] flex justify-center text-white rounded-2xl p-2 mt-5">
              {
                isLoading?
                (<img className='w-14 h-[40px]' src={logo1} />):(<span>Login</span>)
              }
            </button>
          </form>
        </div>
        </div>
      );
}

export default Login