import mongoose from "mongoose";

const infospotSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    frameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Frame",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Infospot =
  mongoose.models.Infospot || mongoose.model("Infospot", infospotSchema);

export default Infospot;
