const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    type:{
        type:String,
        required:true,
        trim:true
    },
    uid:{
        type:String,
        required:true
    },
    wishlist:{type:mongoose.Schema.Types.ObjectId,ref:'wishlist'}
})
const user=mongoose.model('user',userSchema);
module.exports=user