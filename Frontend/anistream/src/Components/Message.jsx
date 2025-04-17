import React from "react";
import cross from "../Assets/wrong.jpg";
const Message = (props) => {
  const { message, setMessage } = props;
  function clearMessage() {
    setMessage("");
  }
  return message && message.length != 0 ? (
    <div className="flex bg-red-300 w-full p-3 border-[3px] border-red-900 justify-between mb-3">
      <p className="text-red-700">{message}</p>
      <button onClick={clearMessage}>
        <img src={cross} className="w-5" alt="" />
      </button>
    </div>
  ) : (
    <span></span>
  );
};

export default Message;
