const mongoose = require("mongoose");
const Episodes = require("./Episode");
const Rating = require("./Rating");
const moviesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
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
  desc: {
    type: String,
    required: true,
    trim: true,
  },
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
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episodes" }],
  type: {
    type: String,
    required: true,
    trim: true,
  },
  nepisodes: {
    type: String,
    required: true,
    trim: true,
  },
  nseasons: {
    type: String,
    required: true,
    trim: true,
  },
  expiryTime:{
    type:Number,
    required:true
  }
});
const Movies = mongoose.model("Movies", moviesSchema);
module.exports = Movies;
