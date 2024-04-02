const express=require('express');
const Series = require('../models/Series');
const Movies = require('../models/Movies');
const Rating = require('../models/Rating');
const { default: mongoose } = require('mongoose');
const router=express.Router()

router.post('/add_series_rating',async(req,res)=>{
    let{uid,id,rating,type}=req.body;
    let x;
    if(type=='s'){
        x=await Series.findById(id)
    }
    else{
        x=await Movies.findById(id)
    }

    uid=new mongoose.Types.ObjectId(uid);
    
    let rate=await Rating.create({rating,'user':uid})
    x.rating.push(rate._id);
    x.trating+=Number(rating)
    x.avg_rating=x.trating/x.rating.length
    await x.save();
    res.status(200).json({'msg':'Rating added'})
})

router.get('/get_updated_series/:type/:id',async(req,res)=>{
    let {id,type}=req.params;
    let e;
    if(type=='s')
    e=await Series.findById(id).populate('rating').exec()
    else
    e=await Movies.findById(id).populate('rating').exec()
    res.status(200).json({e});
})

router.get('/del_rating/:rid/:id/:type',async(req,res)=>{
    let {rid,id,type}=req.params;
    let e;
    if(type=='s')
    e=await Series.findById(id)
    else
    e=await Movies.findById(id)
  
    let x=e.rating.filter(e1=>e1._id.toString() != rid)
    let rating=await Rating.findById(rid);
    e.trating-=(Number)(rating.rating)
    e.rating=x
    
    if(e.rating.length!=0)
    e.avg_rating=e.trating/e.rating.length
    else
    e.avg_rating=0

    await e.save();
    await Rating.findByIdAndDelete(rid)
    res.json({msg:'Deleted'})
})

router.post('/get_rating',async(req,res)=>{
    let{id,type}=req.body;
    let x;
    if(type=='s')
    {
        x=await Series.findById(id)
    }
    else{
        x=await Movies.findById(id)
    }
    res.status(200).json({rating:x.avg_rating});
})
module.exports=router;