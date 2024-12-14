import mongoose from 'mongoose';

const NewTaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: false },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  room: { type: String, required: true },
  floor: { type: String, required: true },
  status: { type: String, required: true },
  tags: { type: [String], default: [] },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Storing user ID for "Assigned By"
  assignee: { type: String, required: true },
  dueDate: { type: Date, required: true },
  emailAlerts: { type: [String], default: [] },
  watchers: { type: [String], default: [] },
  groundFloorImages: [{ url: String }],
  lastFloorImages: [{ url: String }],
  attachments: [{ url: String }],
}, { timestamps: true });






export default mongoose.models.NewTask || mongoose.model('NewTask', NewTaskSchema);
//