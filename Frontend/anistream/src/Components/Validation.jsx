import React from "react";
import tick from "../Assets/tick.gif";
import cross from "../Assets/wrong.jpg";
const Validation = (props) => {
  const { isEmpty, isValid, pic } = props;
  return isEmpty ? (
    <p className="text-[4vh] flex justify-center items-center p-0 m-0">
      <ion-icon name={pic}></ion-icon>
    </p>
  ) : isValid ? (
    <img src={tick} alt="" className="h-[4vh]" />
  ) : (
    <img src={cross} alt="" className="h-[4vh]" />
  );
};

export default Validation;
