import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify"; // Ensure react-toastify is installed

const FolderCreation = ({ user }) => {
  
  const [name,setName] = useState("");
  function handleName(event) {
    setName(event.target.value);
  }

  async function folder_creation(e) {
    e.preventDefault();

    if (user.type !== "admin") {
      toast.warning("Request Rejected", { position: "top-center" });
      return;
    }


    try {
      // Create folder on server
      const fisResponse = await axios.get(
        `https://api.streamwish.com/api/folder/create?key=11124m28yb5z5qbkuh1ru&name=${name+"_"+user._id}`
      );
      console.log(fisResponse)
      if(fisResponse.data.msg!="OK")
        throw Error("Error");
      toast.success("Folder Created");
      
    console.log("Folder Created");
    } catch (error) {
      console.error("Error in folder creation:", error);
      toast.error("Folder Creation Failed");
    }
  }

  return (
    <div className="flex  w-fit gap-96 items-center bg-black/40 p-10 rounded-xl">
        <form className="flex flex-col gap-5 " onSubmit={folder_creation}>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="font-mono text-lg text-white" htmlFor="name">
              Folder Name:
            </label>
            <input
              className="outline-none p-2 border border-white rounded-lg font-mono text-lg bg-transparent text-white"
              type="text"
              id="name"
              name="name"
              onChange={handleName}
              value={name}
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-lg py-2 px-5 text-2xl text-white  bg-blue-500 hover:bg-blue-600 transition-all"
          >
            Submit
          </button>
        </form>     
    </div>
  );
};

export default FolderCreation;
