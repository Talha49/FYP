const mongoose = require("mongoose");

const infoSpotSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  position_x: {
    type: Number,
    required: true,
  },
  position_y: {
    type: Number,
    required: true,
  },
  position_z: {
    type: Number,
    required: true,
  },
  video_id: {
    type: String,
    required: true,
  },
  panorama_id: {
    type: Number,
    required: true,
  },
});

const InfoSpotModel = mongoose.model("infoSpots", infoSpotSchema);
module.exports = InfoSpotModel;
