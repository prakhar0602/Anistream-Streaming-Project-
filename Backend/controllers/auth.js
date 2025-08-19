const user = require('../models/Users');
const Wishlist=require('../models/WishList');
const Series = require('../models/Series');
const Movies = require('../models/Movies');
const Viewed = require('../models/Viewed');
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
        console.log(refreshToken)
        let {type} = jwt.verify(refreshToken,"Prakhar_Gupta")
        console.log(type)
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
                    let token = jwt.sign({id:users._id,email,type:users.type},'Prakhar_Gupta',{
                        expiresIn:60*5
                    });
                    let refreshToken = jwt.sign({id:users._id,email,type:users.type},'Prakhar_Gupta',{
                        expiresIn:'2h'
                    });
                    await OnlineUsers.create({email,token:refreshToken,expiryTime:Date.now()+1000*60*60*2,expireAt:Date.now()+(2*60*60*1000)});
                    const cookieOptions = {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                        domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
                    };
                    
                    res.cookie('accessToken', token, {
                        ...cookieOptions,
                        maxAge: 1000*60*5
                    });
                    res.cookie('refreshToken', refreshToken, {
                        ...cookieOptions,
                        maxAge: 1000*60*60*2
                    });
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
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost'
        };
        
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);
        
        let {email} = jwt.verify(req.cookies.refreshToken,"Prakhar_Gupta")
        await OnlineUsers.deleteOne({email}); 
        res.status(200).json({bool:true,msg:'logout'});
    }
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

const handleAddViewed = async(req,res) => {
    try{
        const {animeId, animeModel} = req.body;
        const {refreshToken} = req.cookies;
        const {id: userId} = jwt.verify(refreshToken, 'Prakhar_Gupta');
        
        const existingViewed = await Viewed.findOne({animeId, animeModel});
        
        if(existingViewed) {
            if(!existingViewed.userId.includes(userId)) {
                existingViewed.userId.push(userId);
                await existingViewed.save();
            }
        } else {
            await Viewed.create({userId: [userId], animeId, animeModel});
        }
        
        res.status(200).json({bool:true, msg:'Viewed added'});
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Something went wrong'});
    }
}

const handleTraining = async(req,res) => {
    try{
        const allViewed = await Viewed.find().populate('animeId');
        console.log(allViewed)
        const trainingData = allViewed.map(view => ({
            user_ids: view.userId,
            anime_id: view.animeId._id,
            name: view.animeId.name,
            genre: view.animeId.genres,
            type: view.animeModel.toLowerCase() 
        }));
        console.log(trainingData)
        const axios = require('axios');
        await axios.post(`http://localhost:5000/api/training`, trainingData);
        res.status(200).json({bool:true, msg:'Training completed'});
    }
    catch(e){
        console.log(e)
        res.status(500).json({bool:false, msg:'Training failed'});
    }
}

const handleGetRecommendations = async(req,res) => {
    try{
        const {refreshToken} = req.cookies;
        const {id: userId} = jwt.verify(refreshToken, 'Prakhar_Gupta');
        
        const axios = require('axios');
        const response = await axios.post(`http://localhost:5000/api/get_recommendation`, {
            user_id: userId
        });
        
        const populatedRecommendations = [];
        for(const rec of response.data.recommendations) {
            if(rec.type === 'series') {
                const anime = await Series.findById(rec.anime_id).populate('seasons rating');
                if(anime) populatedRecommendations.push(anime);
            } else {
                const anime = await Movies.findById(rec.anime_id).populate('seasons rating');
                if(anime) populatedRecommendations.push(anime);
            }
        }
        
        res.status(200).json({bool:true, recommendations: populatedRecommendations});
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to get recommendations'});
    }
}

const handleGetUserStats = async(req,res) => {
    try{
        const totalUsers = await user.countDocuments();
        const onlineUsers = await OnlineUsers.countDocuments();
        
        const {refreshToken} = req.cookies;
        const {id: userId} = jwt.verify(refreshToken, 'Prakhar_Gupta');
        const adminUser = await user.findById(userId).select('username');
        
        res.status(200).json({
            bool: true,
            totalUsers,
            onlineUsers,
            adminUser
        });
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to get user stats'});
    }
}

const handleGetAnimeStats = async(req,res) => {
    try{
        const totalSeries = await Series.countDocuments();
        const totalMovies = await Movies.countDocuments();
        const totalAnimes = totalSeries + totalMovies;
        
        res.status(200).json({
            bool: true,
            totalAnimes,
            totalSeries,
            totalMovies
        });
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to get anime stats'});
    }
}

const handleGetViewedAnalytics = async(req,res) => {
    try{
        const viewedData = await Viewed.find().populate('animeId');
        
        const analytics = viewedData.map(view => ({
            animeId: view.animeId._id,
            name: view.animeId.name,
            cover_image: view.animeId.cover_image,
            big_image: view.animeId.big_image,
            avg_rating: view.animeId.avg_rating || 0,
            viewerCount: view.userId.length,
            type: view.animeModel.toLowerCase()
        }));
        
        res.status(200).json({
            bool: true,
            analytics
        });
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to get viewed analytics'});
    }
}

const handleGetOnlineUsers = async(req,res) => {
    try{
        const onlineUsers = await OnlineUsers.find();
        const userDetails = [];
        
        for(const onlineUser of onlineUsers) {
            const userInfo = await user.findOne({email: onlineUser.email}).select('username email type');
            if(userInfo) {
                userDetails.push({
                    username: userInfo.username,
                    email: userInfo.email,
                    type: userInfo.type,
                    loginTime: onlineUser.expireAt - (2*60*60*1000)
                });
            }
        }
        
        res.status(200).json({
            bool: true,
            onlineUsers: userDetails
        });
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to get online users'});
    }
}

const handleDownloadCSV = async(req,res) => {
    try{
        const axios = require('axios');
        const response = await axios.get(`http://localhost:5000/api/download_csv`, {
            responseType: 'stream'
        });
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="updated_anime_list.csv"');
        response.data.pipe(res);
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to download CSV'});
    }
}

const handleGetUserProfile = async(req,res) => {
    try{
        const {refreshToken} = req.cookies;
        const {id: userId} = jwt.verify(refreshToken, 'Prakhar_Gupta');
        
        const userProfile = await user.findById(userId).select('username email type profile_image');
        
        if(userProfile) {
            res.status(200).json({
                bool: true,
                user: userProfile
            });
        } else {
            res.status(404).json({bool: false, msg: 'User not found'});
        }
    }
    catch(e){
        res.status(401).json({bool: false, msg: 'Authentication required'});
    }
}

const handleGetAllUsers = async(req,res) => {
    try{
        const allUsers = await user.find().select('username email type profile_image');
        
        res.status(200).json({
            bool: true,
            users: allUsers
        });
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to get users'});
    }
}

const handleGetContentCreators = async(req,res) => {
    try{
        const creators = await user.find({type: 'cc'}).select('username email profile_image');
        
        // Get online creator emails
        const onlineUsers = await OnlineUsers.find();
        const onlineCreatorEmails = [];
        for(const onlineUser of onlineUsers) {
            const userInfo = await user.findOne({email: onlineUser.email, type: 'cc'});
            if(userInfo) onlineCreatorEmails.push(onlineUser.email);
        }
        
        // Calculate content stats for each creator
        const creatorStats = await Promise.all(creators.map(async (creator) => {
            const seriesCount = await Series.countDocuments({uploadedBy: creator._id});
            const moviesCount = await Movies.countDocuments({uploadedBy: creator._id});
            
            return {
                ...creator.toObject(),
                seriesCount,
                moviesCount,
                totalContent: seriesCount + moviesCount
            };
        }));
        
        // Get total content (including content with no owner)
        const totalSeries = await Series.countDocuments();
        const totalMovies = await Movies.countDocuments();

        res.status(200).json({
            bool: true,
            creators: creatorStats,
            totalCreators: creators.length,
            activeCreators: onlineCreatorEmails.length,
            totalContent: totalSeries + totalMovies
        });
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to get content creators'});
    }
}

const handleGetCreatorContent = async(req,res) => {
    try{
        const {creatorId} = req.params;
        const [series, movies] = await Promise.all([
            Series.find({uploadedBy: creatorId}).select('name cover_image avg_rating createdAt'),
            Movies.find({uploadedBy: creatorId}).select('name cover_image avg_rating createdAt')
        ]);
        
        res.status(200).json({
            bool: true,
            series,
            movies,
            totalContent: series.length + movies.length
        });
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to get creator content'});
    }
}

const handleGetRegularUsers = async(req,res) => {
    try{
        console.log('Fetching regular users with type: user');
        const regularUsers = await user.find({type: 'user'}).select('username email type profile_image createdAt');
        console.log('Found regular users:', regularUsers.length);
        
        res.status(200).json({
            bool: true,
            users: regularUsers,
            totalUsers: regularUsers.length
        });
    }
    catch(e){
        console.log('Error in handleGetRegularUsers:', e);
        res.status(500).json({bool:false, msg:'Failed to get regular users'});
    }
}

const handleForceLogout = async(req,res) => {
    try{
        const {email} = req.body;
        await OnlineUsers.deleteOne({email});
        
        res.status(200).json({
            bool: true,
            msg: 'User logged out successfully'
        });
    }
    catch(e){
        res.status(500).json({bool:false, msg:'Failed to logout user'});
    }
}

const handleEditProfile = async(req,res) => {
    try{
        const {refreshToken} = req.cookies;
        const {id: userId} = jwt.verify(refreshToken, 'Prakhar_Gupta');
        const {profile_image} = req.body;
        
        const updatedUser = await user.findByIdAndUpdate(
            userId, 
            {profile_image}, 
            {new: true}
        ).select('username email type profile_image');
        
        if(updatedUser) {
            res.status(200).json({
                bool: true,
                user: updatedUser,
                msg: 'Profile updated successfully'
            });
        } else {
            res.status(404).json({bool: false, msg: 'User not found'});
        }
    }
    catch(e){
        res.status(401).json({bool: false, msg: 'Authentication required'});
    }
}

module.exports = {
    handleAddUser,
    handleVerifyToken,
    handleLogin,
    handleFetchWishlist,
    handleToggleWishlist,
    handleLogout,
    sendCode,
    verifyCode,
    handleAddViewed,
    handleTraining,
    handleGetRecommendations,
    handleGetUserStats,
    handleGetAnimeStats,
    handleGetViewedAnalytics,
    handleGetOnlineUsers,
    handleGetAllUsers,
    handleGetContentCreators,
    handleGetCreatorContent,
    handleGetRegularUsers,
    handleForceLogout,
    handleGetUserProfile,
    handleEditProfile,
    handleDownloadCSV
}