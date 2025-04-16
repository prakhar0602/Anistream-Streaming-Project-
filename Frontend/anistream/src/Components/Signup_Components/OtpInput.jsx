import axios from "axios";
import React, { useState } from "react";
import Input from "../Input";
import Message from "../Message";
import loadingGif from '../../Assets/loading....gif'
const { VITE_BACKEND_LINK } = import.meta.env;

const OtpInput = (props) => {
  const { email, setContinue3, setContinue2 } = props;
  const [isLoading,setLoading]=useState(false)
  const [message, setMessage] = useState("");
  const [OTP, setOTP] = useState("");
  const OTPRegex = /^[0-9]{6}$/;
  const otpErrorMessage = "OTP must be of 6 digits";
  async function verifyOTP() {
    try {
      if(OTPRegex.test(OTP)){
        setLoading(true)
      let response = await axios.post(`${VITE_BACKEND_LINK}/verifyOTP`, {
        email,
        OTP,
      });
      if (response.data.bool) {
        setContinue2(false);
        setContinue3(true);
      } else {
        setMessage(response.data.msg);
      }
    setLoading(false)}
      else{
        setMessage("OTP not valid")
      }
    } catch (error) {
      setMessage("Something went wrong. Try Again");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Message message={message} setMessage={setMessage} />
      <h2 className="text-center mb-7 text-white text-3xl  w-fit">
        Verify OTP
      </h2>
      <div className="flex flex-col sm:w-72 w-full">
        <Input
          label="OTP"
          type="number"
          name="OTP"
          regex={OTPRegex}
          pic="logo-codepen"
          message={otpErrorMessage}
          content={OTP}
          setContent={setOTP}
        />
        <button
        type="submit"
        onClick={verifyOTP}
        className="w-full bg-[#58a52c] hover:bg-[#568c37] flex justify-center text-white rounded- p-2 mt-5 tracking-widest text-xl"
        >
        {isLoading ? (
            <img className="w-14 h-[40px]" src={loadingGif} />
        ) : (
            <span>Verify OTP</span>
        )}
      </button>
      </div>
    </div>
  );
};

export default OtpInput;
