const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
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
    trim: true,
    index: true
  },
  fld_id: {
    type: String,
    required: true
  },
  seasons:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Seasons"
  }],
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
  type: {
    type: String,
    required: true,
    trim: true
  },
  nseasons: {
    type: String,
    required: true,
    trim: true
  },
  uploadedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
  },
  genres: [{
    type: String,
    trim: true
  }]
});

const Series = mongoose.model('Series', seriesSchema);
module.exports = Series;
