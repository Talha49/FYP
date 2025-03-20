import mongoose from "mongoose";

// Define the Notification schema
const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentEmail: {
      type: Boolean,
      default: false,
    },
    sentWhatsApp: {
      type: Boolean,
      default: false,
    },
    category: { type: String, enum: ["alert", "general"], required: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    type: { type: String, enum: ["success", "error", "info", "warning", "welcome", "feature"], default: "info" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt` fields
);

// Export the Notification model
export default mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);
