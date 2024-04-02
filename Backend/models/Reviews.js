const mongoose=require('mongoose');
const reviewSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    comment:{
        type:String,
        required:true,
        trim:true
    }
});
const Reviews=mongoose.model('Reviews',reviewSchema);
module.exports=Reviews;