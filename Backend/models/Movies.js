const mongoose = require("mongoose");
const Episodes = require("./Episode");
const Rating = require("./Rating");
const moviesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  big_image: {
    type: String,
    required: true,
    trim: true,
  },
  cover_image: {
    type: String,
    required: true,
    trim: true,
  },
  cover_image2: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  seasons:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Seasons"
  }],
  fld_id: {
    type: String,
    required: true,
  },
  rating: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  avg_rating: {
    type: Number,
    required: true,
  },
  trating: {
    type: Number,
    required: true,
  },

  type: {
    type: String,
    required: true,
    trim: true,
  },

  
  nseasons: {
    type: String,
    required: true,
    trim: true,
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
const Movies = mongoose.model("Movies", moviesSchema);
module.exports = Movies;
