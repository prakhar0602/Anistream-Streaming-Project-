import axios from 'axios';
import React, { useState } from 'react'

const URLUpload = (props) => {
  const [files,setFiles]=useState([])
  const [newUrl,setNewUrl]=useState('')
  const fld_id = props.fld_id;
  const as = props.as;

  function addUrl(){
    let t_files=newUrl.split(",");
    let f_files = [...files,...t_files];
    let ff_files=f_files
    if(f_files.length>50)
      ff_files=f_files.slice(0,50);
    setFiles(ff_files);
    setNewUrl('');
  }
  function changeURL(index,e){
    let t_files=[...files];
    if(e.target.value.length==0)
      t_files.splice(index,1);
    else
      t_files[index]=e.target.value;
    setFiles(t_files);
    console.log(files)
  }
  function removeURL(index){
    let t_files=[...files];
    t_files.splice(index,1);
    setFiles(t_files);
  }
  async function addFiles(){
    for(let i of files){
      let response = await axios.get(`https://api.streamwish.com/api/upload/url?key=11124m28yb5z5qbkuh1ru&url=${i}&fld_id=${fld_id}`);
      console.log(i);
      console.log(response)
    }
  }
  return (
    <div className='flex flex-col justify-center items-center gap-5'>
      <div className='flex flex-col justify-center items-center gap-3'>
        <label className="text-white font-mono text-[18px]" htmlFor="url">Enter URLS for the files</label>
        {
          files.length<=12?(
              files.map((url,index)=>(
                <div className='flex gap-6 justify-center items-center'>
                  <input className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
                    type="text" value={url} id={index} onChange={(e)=>changeURL(index,e) }/>
                  <button className="rounded-[15px] h-fit w-fit py-[5px] px-[20px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#c23c3c] to-[#840000]" onClick={()=>removeURL(index)}>X</button>
                </div>
              ))
          ):(<span className="text-white font-mono text-[18px]"> Total Files : {files.length}</span>)
        }
      </div>
      {
        files.length<51?(
      <div className='flex flex-col justify-center items-center gap-3'>
        <input className="outline-none p-[10px] ml-[10px] grey border-[1.5px] border-white text-[25px] rounded-[10px]"
             type="text" value={newUrl} onChange={(e)=>setNewUrl(e.target.value)} />
        <button className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]" onClick={()=>addUrl()}>Add</button>
      </div>

        ):(<span>No more can be added</span>)
      }
      <button className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]" onClick={()=>addFiles()}>Add Files</button>
    </div>
  )
}

export default URLUpload