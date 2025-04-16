import React, { useState } from "react";
import axios from "axios";
import { login } from "../../Redux/userSlice";
import logo1 from "../../Assets/loading....gif";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Input from "../Input";
const { VITE_BACKEND_LINK } = import.meta.env;

const Form = (props) => {
  const { setMessage } = props;
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailErrorMessage = "Email is not in valid format.";
  const passErrorMessage =
    "Password must contain atleast one uppercase, one lowercase, one digit, and one special character";
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    if (emailRegex.test(email) && passwordRegex.test(password)) {
      setLoading(true);
      try {
        let response = await axios.post(
          `${VITE_BACKEND_LINK}/login`,
          { email, password },
          {
            withCredentials: true,
          }
        );
        response = response.data;
        dispatch(login(response.users));
        setLoading(false);
        if (response.bool) navigate("/");
        else setMessage(response.msg);
      } catch (e) {
        setLoading(false);
        setMessage("An Error Occured. Try Again");
      }
    }
    else{
        setMessage("Some fields are not valid")
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col w-full">
      <Input
        label="Email"
        type="email"
        name="email"
        regex={emailRegex}
        pic="mail"
        message={emailErrorMessage}
        content={email}
        setContent={setEmail}
      />
      <Input
        label="Password"
        type="password"
        name="password"
        regex={passwordRegex}
        pic="key"
        message={passErrorMessage}
        content={password}
        setContent={setPassword}
      />

    <div className="flex gap-3">
    <Link to="/signup" className="bg-[#229c88] w-[50%] hover:bg-[#1e5b50] flex justify-center text-white text-sm font-beastars tracking-widest  p-2 mt-5">
              SignUp
            </Link>
      <button
        type="submit"
        className="bg-[#2b91a1] w-[50%] hover:bg-[#246069] flex justify-center text-white rounded- p-2 mt-5 text-sm font-beastars tracking-widest"
        >
        {isLoading ? (
            <img className="w-14 h-[40px]" src={logo1} />
        ) : (
            <span>Login</span>
        )}
      </button>
        </div>
    </form>
  );
};

export default Form;
