import React, { useState } from "react";
import Validation from "./Validation";

const Input = (props) => {
  const {
    label,
    type,
    name,
    regex,
    pic,
    message,
    content,
    setContent,
    disabled = false, required=false
  } = props;
  const [isEmpty, setEmpty] = useState(true);
  const [validContent, setValidContent] = useState(false);

  function changeFunction(e) {
    if (setContent != undefined) {
      if (name != "OTP" || e.target.value.length <= 6) {
        setContent(e.target.value);
        setEmpty(false);
        setValidContent(regex.test(e.target.value));
        if (e.target.value.length == 0) {
          setEmpty(true);
          setValidContent(false);
        }
      }
    }
  }
  return (
    <div className="flex justify-between w-full items-center gap-2">
      <label className="mb-2 text-white text-xl w-[20%] ">{label}</label>
      <div className="flex flex-col w-[80%] mb-3">
        <div className="sm:p-3 p-2 w-full bg-white/20 flex justify-center items-center gap-2">
          <input
            className="bg-transparent font-serif tracking-wide w-full outline-none text-white"
            type={type}
            name={name}
            onChange={changeFunction}
            value={content}
            disabled={disabled}
            required={required}
          />
          <Validation isEmpty={isEmpty} isValid={validContent} pic={pic} />
        </div>
        {!isEmpty && !validContent ? (
          <p className="h-fit p-0 m-0 text-red-600 w-full flex font-bold">
            {message}
          </p>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

export default Input;
