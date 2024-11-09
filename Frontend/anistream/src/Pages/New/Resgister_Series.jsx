import React, { useEffect, useState } from 'react'
import FileUpload from './FileUpload';
import URLUpload from './URLUpload';
import FolderCreation from '../../Components/Anime_list/New/FolderCreation';
import { useSelector } from 'react-redux';
import LoadingScreen from '../../Components/LoadingScreen';
import "./New.css";
import Form from '../../Components/Anime_list/New/Form';

const Resgister_Series = () => {
    const [showFileUpload,setFileUpload]    = useState(false);
    const [showURLUpload,setURLUpload]      = useState(false);
    const [showForm,setForm]                = useState(false);
    const [name,setName]                    = useState('');
    const [fld_id, setFld_id]               = useState("");
    const [isLoading,setLoading]            = useState(true)
    const [big_image, setBigImage]          = useState("");
    const [cover_image, setCoverImage]      = useState("");
    const [desc, setDesc]                   = useState("");
    const [nepisodes, setEpisodes]          = useState([]);
    const [nseasons, setSeasons]            = useState([]);
    const [type, setType]                   = useState('');
    const [message, setMessage]             = useState("");
    const [as, setas]                       = useState("");
    const user                              = useSelector(state=>state.user.user)
    
    useEffect(()=>{
        setLoading(false)
        if(localStorage.getItem('upload_name'))
            setName(localStorage.getItem('upload_name'));
        if(localStorage.getItem('fld_id'))
            setFld_id(localStorage.getItem('fld_id'));
      },[])
   
    function toggleUploadType(category){
        if(category==1){
            setFileUpload(!showFileUpload);
            setURLUpload(false);
        }
        else{
            setURLUpload(!showURLUpload);
            setFileUpload(false);
        }
    }
  return (
    <div className='w-full max-w-full pt-24 pb-3'>
        {
            isLoading? (
                <LoadingScreen/>
            ):(
                <div className='h-full w-full max-w-full flex flex-col justify-center items-center gap-9'>
                    <div className="flex justify-center items-center">
                        <img src="src/Assets/add_anime.png" className="h-[200px] " alt="image" />
                        <h1 className="-ml-[100px] text-[50px] font-fantasy font-[700]">
                            <span className="a1">Add </span>
                            <span className="a2">Anime</span>
                        </h1>
                    </div>

                    <div className="msg">
                        <h3>{message}</h3>
                    </div>

                    <FolderCreation user={user} setLoading={setLoading} setFld_id={setFld_id} setName={setName} name={name} setas={setas}/>

                    <button onClick={()=>setForm(!showForm)} className='rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]'>{showForm?'Hide Form':'Show Form'}</button>
                    {
                        showForm?(
                            <Form name={name} big_image={big_image} setBigImage={setBigImage} cover_image={cover_image} setCoverImage={setCoverImage} desc={desc} setDesc={setDesc} nepisodes={nepisodes} setEpisodes={setEpisodes} nseasons={nseasons} setSeasons={setSeasons} type={type} setType={setType} setMessage={setMessage} user={user} setLoading={setLoading}/>
                        ):(<span></span>)
                    }


                    <div className='w-full flex gap-14 justify-center'>
                        <button onClick={()=>toggleUploadType(1)}className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]">Upload Files</button>
                        <button onClick={()=>toggleUploadType(2)} className="rounded-[15px] h-fit w-fit py-[10px] px-[30px] text-[20px] border-0  text-white font-fantasy bg-gradient-to-r from-[#ca3bda] to-[#733aba]">Upload By URL</button>
                    </div>

                    <div>
                        {
                            showFileUpload?(
                                <FileUpload as={as} fld_id={fld_id}/>
                            ):(<span></span>)
                        }
                        {
                            showURLUpload?(
                                <URLUpload as={as} fld_id={fld_id}/>
                            ):(<span></span>)
                        }
                    </div>
                </div>)
        }
    </div>
  )
}

export default Resgister_Series