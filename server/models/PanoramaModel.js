const mongoose = require("mongoose");

const panoramaSchema = mongoose.Schema({
  panorama_url: {
    type: String,
    required: true,
  },
});

const PanoramaModel = mongoose.model("panoramas", panoramaSchema);
module.exports = PanoramaModel;
