import React from "react";
import logo from '../Assets/loading.gif'
const LoadingScreen = () => {
  return (
    <div className="h-screen w-full flex justify-center items-center text-white">
      <img src={logo} className="w-32" alt="" />{" "}
      <p className="text-xl ">Loading</p>
    </div>
  );
};

export default LoadingScreen;
