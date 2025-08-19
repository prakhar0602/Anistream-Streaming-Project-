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
    password:{
        type:String,
        required:true,
        trim:true
    },
    profile_image:{
        type:String,
        default:'https://via.placeholder.com/150/cccccc/000000?text=User'
    },
    wishlist:{type:mongoose.Schema.Types.ObjectId,ref:'wishlist'}
})
const user=mongoose.model('user',userSchema);
module.exports=user