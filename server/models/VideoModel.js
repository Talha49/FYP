const { default: mongoose } = require("mongoose");

const videoSchema = mongoose.Schema({
  video_url: {
    type: String,
    required: true,
  },
});

const VideoModel = mongoose.model("videos", videoSchema);
module.exports = VideoModel;
