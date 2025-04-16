const mongoose = require('mongoose')
const Online_UsersSchema= mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true
    },
    token:{
        type:String,
        required:true,
        trim:true
    },
    expiryTime:{
        type:Number,
        required:true,
        trim:true
    },
    expireAt: { 
        type: Date,
        required:true,
        index:{expires: 0 }
    }
})
const Online_Users = mongoose.model('Online_Users',Online_UsersSchema)
module.exports = Online_Users