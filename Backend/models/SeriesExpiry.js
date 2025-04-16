const mongoose=require('mongoose')

const SeriesExpiry=mongoose.Schema({
    series:[{type:mongoose.Schema.Types.ObjectId,ref:'Series'}],
    movies:[{type:mongoose.Schema.Types.ObjectId,ref:'Movies'}],
})

const expirySeries = mongoose.model('expirySeries',SeriesExpiry);
module.exports = expirySeries;