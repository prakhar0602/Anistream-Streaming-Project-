const env=require('dotenv')
env.config()
const express=require('express')
const app=express();
const mongoose=require('mongoose');
const cookie=require('cookie-parser')
const cors=require('cors');
const anime=require('./apis/anime')
const auth=require('./apis/auth')
const likes=require('./apis/likes_dislikes')
const reviews=require('./apis/reviews')
const rating=require('./apis/rating')
const ab=require('./seed')
const PORT=process.env.PORT || 8080
app.use(cors({ 
   credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
 }));
// ab();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
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

app.listen(PORT,()=>{
    console.log("Server is started at",PORT);
})