import mongoose from "mongoose";

const CaptureSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    floor: {
      type: String,
      required: true,
    },
    captureType: {
      type: String,
      required: true,
    },
    captureName: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Capture ||
  mongoose.model("Capture", CaptureSchema);
