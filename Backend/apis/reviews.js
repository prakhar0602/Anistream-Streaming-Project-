const express=require('express');
const Episodes = require('../models/Episode');
const Reviews = require('../models/Reviews');
const router=express.Router();
router.post('/add_review',async(req,res)=>{
    let {name,comment,id}=req.body;
    let x=new Reviews({name,comment});
    let z=await Episodes.findOne({file_code:id});
    z.reviews.push(x._id);
    await x.save();
    await z.save();
    res.status(200).json({'msg':'Review added'});
})
router.post('/get_reviews',async(req,res)=>{
    let {file_code}=req.body;
    let z=await Episodes.findOne({file_code}).populate('reviews')
    res.status(200).json({'reviews':z})
})
router.post('/delete_review',async(req,res)=>{
    let{id,did}=req.body;
    let x=await Episodes.findById(id);
    await Reviews.findByIdAndDelete(did);
    x.reviews=x.reviews.filter((e)=>e.toString()!=did)
    await x.save()
    res.status(200).json({'msg':'deleted'})
})

module.exports=router;