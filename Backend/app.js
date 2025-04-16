const env=require('dotenv')
env.config()
const express=require('express')
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const anime=require('./apis/anime')
const auth=require('./apis/auth')
const likes=require('./apis/likes_dislikes')
const reviews=require('./apis/reviews')
const rating=require('./apis/rating')
const cookie=require('cookie-parser')
const cookieParser=require('cookie-parser')
const ab=require('./seed');
const cron = require('node-cron');
const Series = require('./models/Series');
const Movies = require('./models/Movies');
const expirySeries = require('./models/SeriesExpiry');
const Episodes = require('./models/Episode');
const { default: axios } = require('axios');
const PORT=process.env.PORT || 8080
app.use(cors({ 
    origin:['https://anistream-streaming-project-vaie.vercel.app','http://localhost:5173'],
   credentials:true,
    methods:["GET","POST","PATCH","DELETE"],
    headers: ["Content-Type", "Authorization", "Origin", "Accept"]
 })); 
// ab();
app.use(express.json()) 
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
mongoose.connect(process.env.MONGO_LINK).then(()=>{
    console.log('Database connected');
}).catch((error)=>{ 
    console.log(error.message) 
    console.log('Database connecting error....');
})
app.use(cookie());
app.use(anime);    
app.use(auth)   
app.use(likes)
app.use(reviews)  
app.use(rating)




let task1 = async()=>{
    console.log('start')
    let expiryData = await expirySeries.find()
    expiryData = expiryData[0]
    let series = await Series.find();
    let movies=await Movies.find();
    for(let i of series){
        let currentTime=Date.now();
        let difference = i.expiryTime - currentTime;
        if(difference<0 && !expiryData.series.includes(i._id)){
            expiryData.series.push(i);
        }
    }
    for(let i of movies){
            let currentTime=Date.now();
            let difference = i.expiryTime - currentTime;
            if(difference<0 && !expiryData.movies.includes(i._id)){
                expiryData.movies.push(i);
            }
    }
    await expiryData.save();
    console.log('end')
}

let task2 = async()=>{
    let expiryData = await expirySeries.find().populate('series movies');
    console.log("start");
    let series = expiryData[0].series;
    let movies = expiryData[0].movies;
    for (let i of series){
        for (let j of i.episodes){
            let episode =await Episodes.findById(j);
            let response = await axios.get(`https://api.streamwish.com/api/file/clone?key=11124m28yb5z5qbkuh1ru&file_code=${episode.file_code}&fld_id=${i.fld_id}&file_title=${episode.title}`);
            episode.file_code = response.data.result.filecode;
            await episode.save();
        }
        let time = Date.now()+1000*60*60*24*60;
        i.expiryTime = time;
        await i.save();
    }
    for (let i of movies){
        for (let j of i.episodes){
            let episode =await Episodes.findById(j);
            let response = await axios.get(`https://api.streamwish.com/api/file/clone?key=11124m28yb5z5qbkuh1ru&file_code=${episode.file_code}&fld_id=${i.fld_id}&file_title=${episode.title}`);
            episode.file_code = response.data.result.filecode;
            await episode.save();
        }
        let time = Date.now()+1000*60*60*24*60;
        i.expiryTime = time;
        await i.save();
    }
    expiryData[0].series=[];
    expiryData[0].movies=[];
    await expiryData[0].save();
    console.log("end")
}

cron.schedule('0 0 * * *',task1);
cron.schedule('0 0 1 */2 *', task2);
// task1()`
async function abx(){
await expirySeries.create({series:[],movies:[]})
}
// abx()
app.listen(PORT,()=>{
    console.log("Server is started at",PORT);
}) 