import axios from 'axios';
import React, { useState } from 'react'

const FolderCreation = (props) => {

    let name=props.name;
    let setName=props.setName;
    let setFld_id=props.setFld_id;
    let setLoading = props.setLoading;
    let user=props.user;
    let setas=props.setas;

    function handleName(event) {
        setName(event.target.value);
        localStorage.setItem('upload_name',event.target.value);
    }
    async function folder_creation(e) {
        e.preventDefault();
        if(user.type!='admin'){
          toast.warning('Request Rejected',{
            position:'top-center'
          })
          return
        }
        setLoading(true)
        //create folder on server
        let fis, server;
        try {
          fis = await axios.get(
            `https://api.streamwish.com/api/folder/create?key=11124m28yb5z5qbkuh1ru&name=${name}`
          );
          console.log(fis)
          fis = fis.data.result.fld_id;
          setFld_id(fis);
          localStorage.setItem("fld_id", fis);
        } catch (error) {
          console.log(error);
        }
    
        //create server upload link
        try {
          server = await axios.get(
            "https://api.streamwish.com/api/upload/server?key=11124m28yb5z5qbkuh1ru"
          );
          server = server.data.result;
          setas(server);
          console.log(server);
        } catch (error) {
          console.log(error);
        }
        setLoading(false)
      }


  return (
        <div className="flex gap-[60px]">
        <form className="flex flex-col gap-[20px]" onSubmit={folder_creation}>
          <div className="flex justify-between items-center">
            <label className="text-white font-mono text-[18px]" htmlFor="name">
              Folder Name
            </label>
            <input
              className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
              type="text"
              id="name"
              name="name"
              onChange={handleName}
              value={name}
              />
            <button className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0 ml-[50%] text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]">
              Submit
            </button>
          </div>
        </form>
      </div>
  )
}

export default FolderCreation