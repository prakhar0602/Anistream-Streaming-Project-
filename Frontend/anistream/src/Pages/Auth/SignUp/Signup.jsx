import React, { useState } from "react";
import { createUser } from "../../../firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const {VITE_BACKEND_LINK}=import.meta.env

const Signup = () => {
  let [name, setName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let navigate=useNavigate();

  function changeName(e) {
    setName(e.target.value);
  }
  function changeEmail(e) {
    setEmail(e.target.value);
  }
  function changePassword(e) {
    setPassword(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try{
      let uid = (await createUser(email, password)).user.uid;
    let user = new FormData();
    user.append("email", email);
    user.append("username", name);
    user.append("uid", uid);
    let encoded = new URLSearchParams(user).toString();
    let response = await axios.post(`${VITE_BACKEND_LINK}/add_user`, encoded, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    toast.success('Registeration Successfull',{
      position:'top-center'
    })
    navigate('/login')
  }
  catch(e){
    toast.error('Registeration failed',{
      position:'top-center'
    })
  }
  }

  return (
    <div className='w-full min-h-screen flex items-center'>

    <div className="flex flex-col items-center xl:w-50 w-[90%] sm:w-fit   my-auto mx-auto xl:p-20 sm:p-14 p-5 shadow-xl rounded-xl bg-black/25">
    <h2 className="text-center mb-7 text-white text-3xl w-fit font-bold">Registeration</h2>
    <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col sm:w-72 w-full">
      <div className='flex justify-between w-full items-center'>
      <label className="mb-2 text-white "> Username:
      </label>
        <input className='sm:p-3 p-2 w-[70%]  mb-3 outline-none bg-white/20 text-white' type="text" name="username" onChange={changeName} required />
      </div>
      <div className='flex justify-between w-full items-center'>
      <label className="mb-2 text-white "> Email:
      </label>
        <input className='sm:p-3 p-2 w-[70%]  mb-3 outline-none bg-white/20 text-white' type="email" name="email" onChange={changeEmail} required />
      </div>
      <div className='flex justify-between w-full items-center'>
      <label className="mb-2 text-white"> Password:
      </label>
        <input type="password" name="password"  onChange={changePassword} className="sm:p-3 p-2 w-[70%]  mb-3 outline-none bg-white/20 text-white" required />
      </div>
     
      <button type="submit" className="bg-[#9134ef] hover:bg-[#8142bf] text-white rounded-2xl p-2 mt-5">
        SignUp
      </button>
    </form>
  </div>
  </div>
  );
};

export default Signup;
