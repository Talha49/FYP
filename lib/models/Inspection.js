import mongoose from "mongoose";

const inspectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Inspection =
  mongoose.models.Inspection || mongoose.model("Inspection", inspectionSchema);

export default Inspection;
