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
    position: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
      z: {
        type: Number,
        required: true,
      },
    },
    frame_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    vt_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VTour",
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
