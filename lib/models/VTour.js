import mongoose from "mongoose";

const vTourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    frames: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          center: {
            x: { type: Number, required: true },
            y: { type: Number, required: true },
            z: { type: Number, required: true },
          },
        },
      ],
      required: true,
    },
    inspectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inspection",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const VTour = mongoose.models.VTour || mongoose.model("VTour", vTourSchema);

export default VTour;
