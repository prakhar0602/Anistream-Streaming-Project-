import React, { useState } from "react";
import dp from "../../Assets/Login_DP.png";
import Form from "../../Components/Login_Components/Form";
import Message from "../../Components/Message";
import DP from "../../Components/DP";
import background from "../../Assets/Login_Background.jpg"

const Login = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="h-screen w-screen bg-cover"
      style={{
        background:`url(${background})`
      }}>
      <div className="h-screen w-screen backdrop-blur-sm flex justify-center items-center z-40">
        <div className="flex flex-col w-[30vw]">
          <DP dp={dp} />
          <div className="bg-[#082c46] drop-shadow-xl flex flex-col items-center w-full rounded-xl px-10 py-14 z-10">
            <h2 className="text-center mb-7 text-white text-5xl  w-fit">
              Log In
            </h2>
            <Message message={message} setMessage={setMessage} />
            <Form setMessage={setMessage} />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
