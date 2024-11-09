import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const New = () => {
  
  
 
  let [message2, setMessage2] = useState("");
  let [as, setas] = useState("");
 
  let [folders, setFolders] = useState([]);

  const [isLoading,setLoading] = useState(true)
  const user=useSelector(state=>state.user.user)
 
 
  
 
  
 

  
  return (
    <div>
    
    <div className="py-[90px] flex h-fit justify-center items-center flex-col gap-[40px]">
      <div className="flex gap-14 items-center">
        <div className="flex flex-col gap-9 w-fit items-center">
        
          
          <div className="msg">
            <h3>{message2}</h3>
          </div>
        </div>
      </div>
     
    </div>)}
        </div>
  );
};

export default New;
