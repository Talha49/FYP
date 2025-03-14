import mongoose from "mongoose";

const NewTaskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: { type: String, required: false },
    description: { type: String, required: true },
    priority: { type: String, required: true },
    room: { type: String, required: true },
    floor: { type: String, required: true },
    status: { type: String, required: true },
    tags: { type: [String], default: [] },
    assignees: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
      },
    ],
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Storing user ID for "Assigned By"

    dueDate: { type: Date, required: true },
    emailAlerts: { type: [String], default: [] },
    watchers: { type: [String], default: [] },
    groundFloorImages: [{ url: String }],
    lastFloorImages: [{ url: String }],
    attachments: [{ url: String }],
    vt_id: { type: String },
    frame_id: { type: String },
    position: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.models.NewTask ||
  mongoose.model("NewTask", NewTaskSchema);
//
