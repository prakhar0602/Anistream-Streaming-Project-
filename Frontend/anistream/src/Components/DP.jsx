import React from "react";

const DP = ({ dp }) => {
  return (
    <div className="w-full flex justify-center -mb-10 z-20">
      <div className="overflow-hidden rounded-full w-24 h-24 bg-black border-[1px] border-black flex justify-center items-center">
        <img src={dp} alt="" className="h-24 w-auto object-cover" />
      </div>
    </div>
  );
};

export default DP;
