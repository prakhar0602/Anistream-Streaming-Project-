import React, { useState } from "react";
import Form from "../../Components/Signup_Components/Form";
import OtpInput from "../../Components/Signup_Components/OtpInput";
import EmailInput from "../../Components/Signup_Components/EmailInput";
import DP from "../../Components/DP";
import pic from "../../Assets/Signup_DP.jpg";

const Signup = () => {
  let [email, setEmail] = useState("");
  const [continue1, setContinue1] = useState(true);
  const [continue2, setContinue2] = useState(false);
  const [continue3, setContinue3] = useState(false);

  return (
    <div className="h-screen w-screen bg-[url('src/Assets/Signup_Background.jpg')] bg-cover">
      <div className="h-screen w-screen backdrop-blur-sm flex justify-center items-center">
        <div className="flex flex-col w-[30vw]">
          <DP dp={pic} />
          <div className="bg-[#09381d] drop-shadow-xl flex flex-col items-center w-full rounded-xl px-10 py-14 z-10">
            {continue1 ? (
              <EmailInput
                email={email}
                setEmail={setEmail}
                setContinue1={setContinue1}
                setContinue2={setContinue2}
              />
            ) : (
              <span></span>
            )}
            {continue2 ? (
              <OtpInput
                email={email}
                setContinue2={setContinue2}
                setContinue3={setContinue3}
              />
            ) : (
              <span></span>
            )}
            {continue3 ? <Form email={email} /> : <span></span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
