const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  big_image: {
    type: String,
    required: true,
    trim: true
  },
  cover_image: {
    type: String,
    required: true,
    trim: true
  },
  cover_image2: {
    type: String,
    required: true,
    trim: true
  },
  desc: {
    type: String,
    required: true,
    trim: true
  },
  fld_id: {
    type: String,
    required: true
  },
  rating: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  }],
  trating: { 
    type: Number,
    required: true
  },
  avg_rating: {
    type: Number,
    required: true
  },
  episodes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Episodes'
  }],
  type: {
    type: String,
    required: true,
    trim: true
  },
  nepisodes: {
    type: String,
    required: true,
    trim: true
  },
  nseasons: {
    type: String,
    required: true,
    trim: true
  },
  expiryTime:{
    type:Number,
    required:true
  },
  uploadedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
  }
});

const Series = mongoose.model('Series', seriesSchema);
module.exports = Series;
