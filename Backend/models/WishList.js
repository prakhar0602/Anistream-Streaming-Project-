const mongoose=require('mongoose')
const wishlistSchema=mongoose.Schema({
    series:[{type:mongoose.Schema.Types.ObjectId,ref:'Series'}],
    movies:[{type:mongoose.Schema.Types.ObjectId,ref:'Movies'}]
})
const wishlist=mongoose.model('wishlist',wishlistSchema);
module.exports=wishlist