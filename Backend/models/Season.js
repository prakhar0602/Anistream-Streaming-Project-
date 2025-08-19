const mongoose = require("mongoose");
const seasonSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  seasonNumber: {
    type: Number,
    required: true,
  },
  episodes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episodes",
    },
  ],
  fld_id: {
    type: String,
    required: true,
  },
});
const Seasons = mongoose.model("Seasons", seasonSchema);
module.exports = Seasons;
