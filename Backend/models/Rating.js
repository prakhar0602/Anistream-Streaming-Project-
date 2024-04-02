const mongoose=require('mongoose')
const ratingSchema=mongoose.Schema({
    rating:{
        type:Number,
        required:true,
    },
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
})
const Rating=mongoose.model('Rating',ratingSchema);
module.exports=Rating;