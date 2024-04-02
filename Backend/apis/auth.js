const express = require('express');
const user = require('../models/Users');
const router = express.Router();
const Wishlist=require('../models/WishList');
const Series = require('../models/Series');
const Movies = require('../models/Movies');

router.post('/add_user', async (req, res) => {
    try {
        let { username, uid, email } = req.body;
        let x=await user.create({ username, email, type:'user', uid });
        res.status(200).json({ 'msg': 'Registered' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/login/:uid', async (req, res) => {
    try {
        let { uid } = req.params;
        let users = await user.find({ uid }).populate('wishlist').exec();
        res.cookie('isLoggedIn',"true",{
            httpOnly:false,
            secure:false,
            expires:Date.now()+24*60*60*1000,
            maxAge:24*60*60*1000
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/login_status', async (req, res) => {
    console.log(req.cookies)
            if(req.cookies.isLoggedIn)
                res.status(200).json({ login_status: true });
            else
                res.status(200).json({ login_status: false });
});
router.post('/get_wishlist',async(req,res)=>{
    let {id}=req.body;
    let use=await user.findById(id).populate('wishlist').exec()
    let wishlist=use.wishlist
    let series=[]
    let movies=[]
    for( let i of wishlist.series){
        let x=await Series.findById(i)
        series.push(x)
    }
    for( let i of wishlist.movies){
        let x=await Movies.findById(i)
        movies.push(x)
    }
    res.status(200).json({series,movies})
})
router.post('/toggle_wishlist',async(req,res)=>{
    let {x,id}=req.body;
    let u=await user.findById(id);
    let w=await Wishlist.findById(u.wishlist);
    let y
    if(x.type=='s'){
        if(w.series.includes(x._id)){
            w.series=w.series.filter((e)=>e!=x._id)
            y=false
        }
        else{
            y=true
            w.series.push(x._id)
        }
    }
    else{
        if(w.movies.includes(x._id)){
            w.movies=w.movies.filter((e)=>e!=x._id)
            y=false
        }
        else{
            y=true
            w.movies.push(x._id)
        }
    }
    await w.save();
    res.status(200).json({y});
})

router.get('/logout',async(req,res)=>{
    await res.clearCookie('isLoggedIn')
    res.status(200).json({msg:'logout'})
})

module.exports = router;
