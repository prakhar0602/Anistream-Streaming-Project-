const { animeSchema } = require("./helpers/animeSchema");
const { signupSchema, loginSchema } = require("./helpers/authSchema");
const Online_Users = require("./models/Online_Users");
const jwt = require('jsonwebtoken');
const Series = require("./models/Series");
const Movies = require("./models/Movies");

const refreshToken = async (req,res,next)=>{
    try{
        let token = req.cookies.accessToken;
        let refreshToken = req.cookies.refreshToken;
        let currents = await Online_Users.find({token:refreshToken})
        for(let current of currents){
            if(token==undefined && Date.now()<=current.expiryTime){
                let {email} = jwt.verify(refreshToken,'Prakhar_Gupta');
                token=jwt.sign(email,'Prakhar_Gupta');
                res.cookie('accessToken',token,{
                    httpOnly:true,
                    secure:true,
                    sameSite:'strict',
                    maxAge:1000*60*5
                })
                break;
            }
        }
        next(); 
    }
    catch(e){
        // console.log(e.message);
        res.json({bool:false})
    }
} 


const validateAnime = (name,big_image,cover_image,desc,fld_id,nepisodes,nseasons)=>{
    let {error} = animeSchema.validate({name,big_image,cover_image,desc,fld_id,nepisodes,nseasons});
    if(error){
        return error.details[0].context.label
    }
    return "Anime Validated";
}


const validateLogin = (req,res,next) => {
    let {email,password}=req.body
    const {error} = loginSchema.validate({email,password})
    if(error){
        res.status(200).json({bool:false,msg:error.details[0].message})
    }
    else{
        next();
    }
}

const validateEditUser = async(req,res,next) => {
    try{
        const {refreshToken} = req.cookies;
        const {id: userID} = jwt.verify(refreshToken, 'Prakhar_Gupta');
        console.log(userID)
        let {id,type} = req.body;
        if(type=='series'){
            let series = await Series.findById(id);
            if(series.uploadedBy==userID)
                return next();
        }
        else {
            let movies = await Movies.findById(id);
            if(movies.uploadedBy==userID)
                return next();
        }
        return res.status(200).json({bool:false,msg:"User not have permission to edit"});
    }
    catch(e){
        res.status(500).json({bool:false,msg:"Authentication failed"});
    }
}

const validateAdmin = async(req,res,next) => {
    try{
        const {refreshToken} = req.cookies;
        const {type} = jwt.verify(refreshToken, 'Prakhar_Gupta');
        if(type === 'admin'){
            return next();
        }
        return res.status(403).json({bool:false,msg:"Admin access required"});
    }
    catch(e){
        res.status(401).json({bool:false,msg:"Authentication failed"});
    }
}

const validateSignup = (req,res,next) => {
    let {username,email,password,repeat_password} = req.body;
    const {error} = signupSchema.validate({username,email,password,repeat_password});
    if(error){
        console.log(error.details[0].message)
        res.status(500).json({bool:false,msg:error.details[0].message})
    }
    else{
        next();
    }
}
 
module.exports = {refreshToken,validateAnime,validateLogin,validateSignup,validateEditUser,validateAdmin} 