import React from "react";

const Genre = ({ title, image }) => {
  return (
    <div className="relative group w-40 hover:scale-110 tranision duration-500 h-24 ml-3 my-3 lg:w-72 lg:h-52 bg-gray-800 rounded-lg overflow-hidden cursor-pointer">
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full lg:w-72 lg:h-52 object-cover "
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300 group-hover:opacity-70"></div>

      {/* Title */}
      <div className="absolute inset-0 flex justify-start items-end p-5 text-white text-lg lg:text-xl font-semibold">
        <p className="w-fit h-fit">
            {title}
        </p>
      </div>
    </div>
  );
};

export default Genre;
