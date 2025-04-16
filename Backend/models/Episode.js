const mongoose=require('mongoose')
const Reviews=require('./Reviews')
const episodeSchema=mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    file_code:{
        type:String,
        required:true,
        trim:true
    },
    snap_link:{
        type:String,
        trim:true
    },
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
    dislikes:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
    reviews:[{type:mongoose.Schema.Types.ObjectId,ref:'Reviews'}],
})
const Episodes=mongoose.model('Episodes',episodeSchema);
module.exports=Episodes