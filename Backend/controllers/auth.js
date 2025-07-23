const user = require('../models/Users');
const Wishlist=require('../models/WishList');
const Series = require('../models/Series');
const Movies = require('../models/Movies');
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')
const OnlineUsers = require('../models/Online_Users');
const { sendOTP } = require('../functions/nodemailerApi');

let OTPs={};

const handleAddUser = async (req, res) => {
    try { 
        let { username, password, email} = req.body;
        if(OTPs[email]!=undefined && OTPs[email].verified){
        let User = await user.find({email})
        if(User!=undefined){
            let y=new Wishlist()
            await y.save()
            let hashpass = await bcrypt.hash(password,10);
            let x=await user.create({ username, email, type:'user', password:hashpass ,wishlist:y._id });
            res.status(200).json({ bool:true, msg: 'Registered' });
        }
        else{
            res.status(200).json({bool:false, msg:'Email already registered'})
        }}
        else
        res.status(200).json({bool:false, msg:'Email not verified'})
    } catch (error) { 
        console.log(error.message)
        res.status(500).json({ bool:false , msg:"Something went wrong" });
    }
}

const handleVerifyToken = async(req,res)=>{
    try{
        let {refreshToken} = req.cookies
        let {type} = jwt.verify(refreshToken,"Prakhar_Gupta")
        if(type)
            res.json({bool:true,type})
        else
            res.json({bool:false})
    }
    catch(e){
        res.json({bool:false})}
}

const handleLogin = async (req, res) => { 
    try {
        let { email,password } = req.body;
        let users = await user.findOne({ email }).populate('wishlist').exec();
        if(users){ 
            await bcrypt.compare(password,users.password,async function(err,result){
                if(result){
                    let token = jwt.sign({email,type:users.type},'Prakhar_Gupta',{
                        expiresIn:60*5
                    });
                    let refreshToken = jwt.sign({email,type:users.type},'Prakhar_Gupta',{
                        expiresIn:'2h'
                    });
                    await OnlineUsers.create({email,token:refreshToken,expiryTime:Date.now()+1000*60*60*2,expireAt:Date.now()+(2*60*60*1000)});
                    res.cookie('accessToken',token,{
                        httpOnly:true,
                        secure:true,
                        sameSite:'None',
                        maxAge:1000*60*5
                    })
                    res.cookie('refreshToken',refreshToken,{
                        httpOnly:true,
                        secure:true,
                        sameSite:'None',
                        maxAge:1000*60*60*2
                    })
                    res.status(200).json({users,bool:true,msg:"Login Successfull"});
                }
                else 
                    res.status(200).json({bool:false,msg:"Invalid Credentials"});
            })

        }
        else{
            res.status(200).json({bool:false,msg:"Invalid Credentials"});
        }
    } catch (error) {
        res.status(500).json({ error: error.message, bool:false, msg:"Something went Wrong. Try Again" });
    }
}

const handleFetchWishlist = async(req,res)=>{
    let {id}=req.body;
    let use=await user.findById(id).populate('wishlist').exec()
    console.log(use);
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
}

const handleToggleWishlist =  async(req,res)=>{
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
}

const handleLogout = async(req,res)=>{
    try{
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken');
        let {email} = jwt.verify(req.cookies.refreshToken,"Prakhar_Gupta")
        await OnlineUsers.deleteOne({email}); 
        res.status(200).json({bool:true,msg:'logout'})}
        catch(e){
            res.status(200).json({bool:false,msg:'logout failed'})
        }
}

const sendCode = async(req,res)=>{
    try{
        const {email} = req.body;
        // console.log(email)
        const User = await user.findOne({email});
        if(User==undefined) {
        let set = Object.values(OTPs);
        let OTP;
        do{
            OTP = Math.random()*1000000;
        }while(set.includes(OTP));
        OTP = Math.floor(OTP);
        OTP=""+OTP
        if(OTP.length==5)
            OTP = "0"+OTP
        await sendOTP(OTP,email);
        OTPs[email]={OTP,expiry:Date.now()+1000*60*11,verified:false};
        console.log(OTPs)
        res.status(200).json({bool:true});
    }
    else{
        res.status(200).json({bool:false,msg:'Email already registered'});
    }
    }
    catch(e){
        console.log(e.message);
        res.status(200).json({bool:false});
    }
}

const verifyCode = async(req,res) => {
    try{
        const {OTP,email} = req.body;
        if(OTPs[email].OTP==OTP && Date.now()<=OTPs[email].expiry){
            OTPs[email].verified=true;
            res.status(200).json({bool:true});
        }
        else if(OTPs[email].OTP!=OTP)
            res.status(200).json({bool:false,msg:"OTP Mismatch"})
        else
            res.status(200).json({bool:false,msg:"OTP expired"})
    }
    catch(e){
        res.status(200).json({bool:false,msg:"Something went wrong"});
    }
}

module.exports = {
    handleAddUser,
    handleVerifyToken,
    handleLogin,
    handleFetchWishlist,
    handleToggleWishlist,
    handleLogout,sendCode,verifyCode
}