const express=require('express');
const router=express.Router();
const { add_Anime, edit_Anime, delete_Anime, get_Series, get_Movies } = require('../functions/anime_operations');
const Episodes = require('../models/Episode');
const { default: axios } = require('axios');


router.get('/get_series',async(req,res)=>{
    let x=await get_Series()
    // console.log(x)
    res.status(200).json(x);
})

router.get('/get_movies',async(req,res)=>{
    let x=await get_Movies();
    res.status(200).json(x);
})

router.post('/delete_anime',async(req,res)=>{
    let{id,type}=req.body;
    await delete_Anime(id,type)
    res.status(200).json({'msg':'Deleted'}) 
})

router.post('/edit_anime',async(req,res)=>{
    let {name,cover_image,big_image,desc,fld_id,type,nseasons,nepisodes,id}=req.body;
    await edit_Anime(name,cover_image,big_image,desc,fld_id,type,nseasons,nepisodes,id)
    res.status(200).json({data:'Data updated'});
})

router.post('/add_anime',async(req,res)=>{
    let {name,cover_image,big_image,desc,fld_id,type,nseasons,nepisodes}=req.body;
    await add_Anime(name,cover_image,big_image,desc,fld_id,type,nseasons,nepisodes)
    res.status(201).json({data:'Data added'});
})

router.get('/get_file_code/:id',async(req,res)=>{
    let{id}=req.params;
    let x=await Episodes.findById(id);
    x=x.file_code
    res.status(200).json(x)
})

router.post('/get_info',async(req,res)=>{
    const {eps}=req.body;
    let info=[]
    for(i of eps){
        let response=await axios.get(`https://api.streamwish.com/api/file/info?key=${process.env.API_KEY}&file_code=${i.file_code}`)
            let x=response.data.result[0]

        info.push(x)
    }
    res.status(200).json({info})
})

module.exports=router; 