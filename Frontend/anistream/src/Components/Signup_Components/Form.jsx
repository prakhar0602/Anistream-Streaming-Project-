import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Input";
import Message from "../Message";
import loadingGif from '../../Assets/loading....gif'
const { VITE_BACKEND_LINK } = import.meta.env;

const Form = (props) => {
  const { email } = props;
  const [isLoading,setLoading] = useState(false)
  const [message, setMessage] = useState("");
  const emailErrorMessage = "Email is not in valid format.";
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  let [name, setName] = useState("");
  const nameRegex = /^[^\s]{6,}$/;
  const nameErrorMessage = "Username's length must be in range 6-18";

  let [password, setPassword] = useState("");
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
  const repeatpasswordRegex = new RegExp(`^${password}$`, "i");
  const passErrorMessage =
    "Password must contain atleast one uppercase, one lowercase, one digit, and one special character";
  const rpassErrorMessage =
    "Both passwords must match. First write password1 and then password2";

  let [password2, setPassword2] = useState("");
  let navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if(emailRegex.test(email) && nameRegex.test(name) && passwordRegex.test(password) && repeatpasswordRegex.test(password2)){
      setLoading(true);
        let user = new FormData();
      user.append("email", email);
      user.append("username", name);
      user.append("password", password);
      user.append("repeat_password", password2);
      let encoded = new URLSearchParams(user).toString();
      let response = await axios.post(
        `${VITE_BACKEND_LINK}/add_user`,
        encoded,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.bool) navigate("/login");
      else setMessage(response.data.msg);
    setLoading(false)}
      else{
        setMessage("Some fields are not valid")
      }
    } catch (e) {
      setMessage("Something went wrong. Try again");
    }
  }
  return (
    <div className="flex flex-col justify-center items-center ">
      <Message message={message} setMessage={setMessage} />
      <h2 className="text-center mb-7 text-white text-3xl font-bold w-fit">
        Registeration
      </h2>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col w-full">
        <Input
          label="Username"
          type="text"
          name="username"
          regex={nameRegex}
          pic="person"
          message={nameErrorMessage}
          content={name}
          setContent={setName}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          regex={emailRegex}
          pic="mail"
          message={emailErrorMessage}
          content={email}
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
        <Input
          label="Repeat Password"
          type="password"
          name="repeat_password"
          regex={repeatpasswordRegex}
          pic="key"
          message={rpassErrorMessage}
          content={password2}
          setContent={setPassword2}
        />
        <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-[#58a52c] hover:bg-[#568c37] flex justify-center text-white rounded- p-2 mt-5 font-semibold"
        >
        {isLoading ? (
            <img className="w-14 h-[40px]" src={loadingGif} />
        ) : (
            <span>Register</span>
        )}
      </button>
      </form>
    </div>
  );
};

export default Form;
