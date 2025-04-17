import axios from "axios";
import React, { useState } from "react";
import Input from "../Input";
import Message from "../Message";
const { VITE_BACKEND_LINK } = import.meta.env;
import loadingGif from '../../Assets/loading....gif'
import { Link } from "react-router-dom";

const EmailInput = (props) => {
  const { email, setEmail, setContinue1, setContinue2 } = props;
  const [isLoading,setLoading] = useState(false)
  const [message, setMessage] = useState("");
  const emailErrorMessage = "Email is not in valid format.";
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  async function sendOTP() {
    try {
      if(emailRegex.test(email)){
      setLoading(true)
      let response = await axios.post(`${VITE_BACKEND_LINK}/sendOTP`, {
        email,
      });
      console.log(response)
      if (response.data.bool) {
        setContinue1(false);
        setContinue2(true);
      } else {
        setMessage(response.data.msg);
      }}
      else{
        setMessage("Email not valid")
      }
    } catch (error) {
      setMessage("Something went wrong. Try Again");
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <Message message={message} setMessage={setMessage} />
      <h2 className="text-center mb-7 text-white text-3xl w-fit">
        Verify Email
      </h2>
      <Input
        label="Email"
        type="email"
        name="email"
        regex={emailRegex}
        pic="mail"
        message={emailErrorMessage}
        content={email}
        setContent={setEmail}
        required:true
      />
       <div className="flex gap-3 w-full">
    <Link to="/login" className="bg-[#11a3ba] w-[50%] hover:bg-[#288d9c] flex justify-center items-center text-white text-[13px] font-beastars p-2 mt-5">
              Login
            </Link>
      <button
        type="submit"
        onClick={sendOTP}
        className="w-[50%] bg-[#58a52c] hover:bg-[#568c37] flex justify-center text-white rounded- p-2 mt-5 text-[13px] font-beastars"
        >
        {isLoading ? (
            <img className="w-14 h-[40px]" src={loadingGif} />
        ) : (
            <span>Send OTP</span>
        )}
      </button>
        </div>
    </div>
  );
};

export default EmailInput;
